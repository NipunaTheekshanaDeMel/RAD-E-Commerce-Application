class ProductDTO {
    constructor(id, name, description, price, image, category, stock, featured = false, specs = {}) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.image = image;
        this.category = category;
        this.stock = stock;
        this.featured = featured;
        this.specs = specs;
    }

    // Method to return a formatted product object
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            price: this.price,
            image: this.image,
            category: this.category,
            stock: this.stock,
            featured: this.featured,
            specs: this.specs,
        };
    }
}

module.exports = ProductDTO;
