const express = require('express');
const {addOrder, updateStatus, getOrders} = require("../controllers/orderController");
const authenticateJWT = require("../middleware/authenticateJWT");

const router = express.Router();


router.post('/add', authenticateJWT(['ADMIN', 'USER']), addOrder)

router.patch('/update/status/:id', authenticateJWT(['ADMIN']), updateStatus)

router.get('/get',authenticateJWT(['ADMIN', 'USER']), getOrders);



module.exports = router;
