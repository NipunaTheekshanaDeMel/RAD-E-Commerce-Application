const express = require('express');
const router = express.Router();
const { addProduct, getProduct, getProducts, updateProduct ,deleteProduct} = require('../controllers/productController');
const authenticateJWT = require("../middleware/authenticateJWT");



router.post('/add', authenticateJWT(['ADMIN']), addProduct)

router.get('/getSelected/:id', authenticateJWT(['ADMIN', 'USER']), getProduct);

router.get('/products', authenticateJWT(['ADMIN', 'USER']), getProducts);

router.put('/update/:id',authenticateJWT(['ADMIN']), updateProduct)

router.delete('/delete/:id', authenticateJWT(['ADMIN']), deleteProduct)



module.exports = router;
