const express = require('express');
const {getEmployeesByService} = require('../controllers/employeeController');

const router = express.Router();

router.get('/service/:serviceId, getEmployeesByService');

module.exports = router;
