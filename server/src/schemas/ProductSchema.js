const mongoose = require('mongoose');
const { Schema } = mongoose;

// Create a Mongoose schema for Product
const productSchema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String },
        price: { type: Number, required: true },
        image: { type: String },
        category: { type: String, required: true },
        stock: { type: Number, required: true, default: 0 },
        featured: { type: Boolean, default: false },
        specs: { type: Map, of: String }, // Stores dynamic key-value pairs
    },
    { timestamps: true } // Adds createdAt & updatedAt
);

// Create and export the model
const Product = mongoose.model('Product', productSchema);
module.exports = Product;
