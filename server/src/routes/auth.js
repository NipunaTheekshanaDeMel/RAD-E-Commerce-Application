const express = require('express');
const { signUp, signIn, currentUser, allUsers } = require('../controllers/authController');

const router = express.Router();

router.post('/signUp', signUp);

router.post('/signIn', signIn)

router.get('/me', currentUser)

router.get('/users', allUsers)


module.exports = router;
