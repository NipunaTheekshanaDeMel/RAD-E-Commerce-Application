const ProductDTO = require('../dtos/productDTO');
const {addNewProduct, getProductById, getAllProducts, updateSelectedProduct, deleteSelectedProduct} = require("../services/productService")

async function addProduct(req, res) {

    const dto = new ProductDTO(
        "",
        req.body.name,
        req.body.description,
        req.body.price,
        req.body.image,
        req.body.category,
        req.body.stock,
        req.body.featured,
        req.body.specs,
    )

    const result = await addNewProduct(dto);

    if (result.error){
        return res.status(400).send({"Status": "error"});

    }

    res.status(200).json(result);


}

async function getProduct(req, res) {

    const productId = req.params.id;

    if (!productId) {
        return res.status(400).send("Id required");
    }

    const product = await getProductById(productId)

    if (!product) {
        return res.status(400).send({"Status": "error"});
    }

    return res.status(200).json(product)
}

async function getProducts(req, res) {

    const products = await getAllProducts();

    if (!products) {
        return res.status(400).send({"Status": "error"});
    }

    if (products.error){
        return res.status(400).send({"Status": "error"});
    }

    res.status(200).json(products)
}

async function updateProduct(req, res) {
    const productId = req.params.id;
    if (!productId) {
        return res.status(400).send("Id required");

    }

     const dto = new ProductDTO(
        "",
        req.body.name,
        req.body.description,
        req.body.price,
        req.body.image,
        req.body.category,
        req.body.stock,
        req.body.featured,
        req.body.specs,
    )


    const response = updateSelectedProduct(productId, dto);

    if (response.error) {
        return res.status(400).send({"Status": "error"});
    }

    res.status(200).json(response);

}

async function deleteProduct(req, res) {
    const productId = req.params.id;

    if (!productId) {
        return res.status(400).send("Id required");
    }

    const product = await deleteSelectedProduct(productId);

    if (!product) {
        return res.status(400).send({"Status": "error"});
    }

    return res.status(200).json(product)

}

module.exports = {addProduct, getProduct, getProducts, updateProduct, deleteProduct};
