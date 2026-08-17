const express = require('express');
const {
    getStats,
    getAllServices,
    createService,
    updateService,
    deleteService,
    getAllEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee
} = require('../controllers/adminContoller');

const authMiddleware = require('../middleware/auth');
const {isAdmin} = require('../middleware/roleCheck');

const router = express.Router();

//Όλα τα ADMIN routes χρειάζονται authentication και ADMIN role
router.use(authMiddleware);
router.use(isAdmin);

//Dashboard
router.get('/stats', getStats);
//Services
router.get('/services', getAllServices);
router.post('/services', createService);
router.put('/services', updateService);
router.delete('/services',deleteService);
//Employees
router.get('/services', getAllEmployees);
router.post('/services', createEmployee);
router.put('/services', updateEmployee);
router.delete('/services',deleteEmployee);

module.exports = router;




