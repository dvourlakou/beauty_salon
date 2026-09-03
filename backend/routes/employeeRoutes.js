const express = require('express');
const {getEmployeesByService,getAllEmployees} = require('../controllers/employeeController');

const router = express.Router();

/**
 * @swagger
 * /api/employees:
 *   get:
 *     summary: Λήψη όλων των υπαλλήλων
 */

router.get('/', getAllEmployees);

/**
 * @swagger
 * /api/employees/service/{serviceId}:
 *   get:
 *     summary: Λήψη υπαλλήλων ανα υπηρεσία
 *
 */

router.get('/services/:serviceId', getEmployeesByService);

module.exports = router;
