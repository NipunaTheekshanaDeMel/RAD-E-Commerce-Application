const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the shipping address schema
const shippingAddressSchema = new Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true }
});

// Define the cart item schema
const cartItemSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    }
});

// Create the order schema
const orderSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        items: [cartItemSchema],
        total: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            required: true,
            enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
            default: 'pending'
        },
        shippingAddress: shippingAddressSchema
    },
    { timestamps: true } // This adds createdAt & updatedAt timestamps
);

// Create and export the model
const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
