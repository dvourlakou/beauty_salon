const express = require('express');
const {register,login} = require('../controllers/authController');

const router = express.Router();

//public endpoints(δεν απαιτείται authentication)
router.post('/register', register);
router.post('/login', login);

module.exports = router;
