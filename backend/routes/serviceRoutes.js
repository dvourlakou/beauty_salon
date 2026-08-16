const express = require('express');
const {getAllCategories,getServiceById} = require('../controllers/authContoller');

const router = express.Router();

//public endpoints(δεν απαιτείται authentication)
router.get('/categories', getAllCategories);
router.get('/id', getServiceById);

module.exports = router;