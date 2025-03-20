const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require('cookie-parser');
const auth = require('./routes/auth');
const product = require('./routes/product');
const order = require('./routes/order');
const connectDB = require('./config/db');
const seedRoles = require('./utills/seedRoles');

require('dotenv').config();

app.use(cookieParser());
app.use(express.json());
app.use(cors());

connectDB().then(r => {
    seedRoles().then(r => {
    })
});

app.use('/api/v1/auth', auth);
app.use('/api/v1/product', product);
app.use('/api/v1/order', order);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
