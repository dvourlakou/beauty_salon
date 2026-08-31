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
} = require('../controllers/adminController');

const authMiddleware = require('../middleware/auth');
const {isAdmin} = require('../middleware/roleCheck');

const router = express.Router();

//Όλα τα ADMIN routes χρειάζονται authentication και ADMIN role
//router.use(authMiddleware);
//router.use(isAdmin);

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Λήψη στατιστικών για το dashboard
 *     responses:
 *       200:
 *         description: Στατιστικά dashboard
 *       403:
 *         description: Απαιτείται διαχείριση μόνο από admin
 */

//Dashboard
router.get('/stats', getStats);

//SERVICES

/**
 * @swagger
 * /api/admin/services:
 *   get:
 *     summary: Λήψη όλων των υπηρεσιών (admin)
 *     responses:
 *       200:
 *         description: Λίστα υπηρεσιών
 *       403:
 *         description: Απαιτείται ρόλος admin
 */


router.get('/services', getAllServices);

/**
 * @swagger
 * /api/admin/services:
 *   post:
 *     summary: Δημιουργία νέας υπηρεσίας (admin)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - categoryId
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               categoryId:
 *                 type: integer
 *               durationMinutes:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Η υπηρεσία δημιουργήθηκε
 *       403:
 *         description: Απαιτείται ρόλος admin
 *
 */


router.post('/services', createService);

/**
 * @swagger
 * /api/admin/services/{id}:
 *   put:
 *     summary: Ενημέρωση μιας υπηρεσίας (admin)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Η υπηρεσία ενημερώθηκε
 *       403:
 *         description: Απαιτείται ρόλος admin
 */


router.put('/services/:id', updateService);

/**
 * @swagger
 * /api/admin/services/{id}:
 *   delete:
 *     summary: Διαγραφή μιας υπηρεσίας (admin)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Η υπηρεσία διαγράφηκε
 *       403:
 *         description: Απαιτείατι ρόλος admin
 */


router.delete('/services/:id',deleteService);



//EMPLOYEES


/**
 * @swagger
 * /api/admin/employees:
 *   get:
 *     summary: Λήψη όλων των αισθητικών (admin)
 *     responses:
 *       200:
 *         description: Λίστα αισθητικών
 *       403:
 *         description: Απαιτείται ρόλος admin
 */

router.get('/employees', getAllEmployees);


/**
 * @swagger
 * /api/admin/employees:
 *   post:
 *     summary: Δημιουργία νέου αισθητικού (admin)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - specialization
 *             properties:
 *               name:
 *                 type: string
 *               specialization:
 *                 type: string
 *                 enum: [NAIL, WAXING, MASSAGE]
 *     responses:
 *       201:
 *         description: Η αισθητικός δημιουργήθηκε
 *       403:
 *         description: Απαιτείται ρόλος admin
 *
 */


router.post('/employees', createEmployee);


/**
 * @swagger
 * /api/admin/employees/{id}:
 *   put:
 *     summary: Ενημέρωση μιας αισθητικού (admin)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Η αισθητικός ενημερώθηκε
 *       403:
 *         description: Απαιτείται ρόλος admin
 */



router.put('/employees/:id', updateEmployee);


/**
 * @swagger
 * /api/admin/employees/{id}:
 *   delete:
 *     summary: Διαγραφή μιας αισθητικού (admin)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Η αισθητικός διαγράφηκε
 *       403:
 *         description: Απαιτείατι ρόλος admin
 */

router.delete('/employees/:id',deleteEmployee);

module.exports = router;




