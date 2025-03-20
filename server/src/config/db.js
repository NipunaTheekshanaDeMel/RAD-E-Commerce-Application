const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB Atlas');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); // Exit process if connection fails
    }
};

module.exports = connectDB;
