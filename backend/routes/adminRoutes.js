const express = require('express');
const {
    getStats,
    getAllAppointments,
    getWeeklyAppointments,
    getEmployeeWorkload,
    updateAppointmentStatus,
    completeAppointment,
    deleteAppointment,
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
const { isAdmin } = require('../middleware/roleCheck');

const router = express.Router();

// Προστασία όλων των admin routes
// router.use(authMiddleware);
// router.use(isAdmin);

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Λήψη στατιστικών για το dashboard
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Στατιστικά dashboard
 *       403:
 *         description: Απαιτείται ρόλος admin
 */
router.get('/stats', getStats);

/**
 * @swagger
 * /api/admin/workload:
 *   get:
 *     summary: Λήψη φόρτου εργασίας αισθητικών
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Επιτυχής επιστροφή φόρτου εργασίας
 */
router.get('/workload', getEmployeeWorkload);

// ==========================================
// APPOINTMENTS (Ραντεβού)
// ==========================================

/**
 * @swagger
 * /api/admin/appointments:
 *   get:
 *     summary: Λήψη όλων των ραντεβού (για τη διαχείριση ραντεβού)
 *     tags: [Admin - Appointments]
 *     responses:
 *       200:
 *         description: Λίστα όλων των ραντεβού
 */
router.get('/appointments', getAllAppointments);

/**
 * @swagger
 * /api/admin/appointments/weekly:
 *   get:
 *     summary: Λήψη εβδομαδιαίων ραντεβού
 *     tags: [Admin - Appointments]
 *     responses:
 *       200:
 *         description: Λίστα εβδομαδιαίων ραντεβού
 */
router.get('/appointments/weekly', getWeeklyAppointments);

/**
 * @swagger
 * /api/admin/appointments/{id}/status:
 *   patch:
 *     summary: Ενημέρωση κατάστασης ραντεβού (PENDING, CONFIRMED, CANCELLED, COMPLETED)
 *     tags: [Admin - Appointments]
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
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, CONFIRMED, CANCELLED, COMPLETED]
 *     responses:
 *       200:
 *         description: Επιτυχής ενημέρωση κατάστασης
 */
router.patch('/appointments/:id/status', updateAppointmentStatus);

/**
 * @swagger
 * /api/admin/appointments/{id}/complete:
 *   patch:
 *     summary: Ολοκλήρωση ραντεβού (shortcut)
 *     tags: [Admin - Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Το ραντεβού ολοκληρώθηκε
 */
router.patch('/appointments/:id/complete', completeAppointment);

/**
 * @swagger
 * /api/admin/appointments/{id}:
 *   delete:
 *     summary: Διαγραφή ραντεβού
 *     tags: [Admin - Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Το ραντεβού διαγράφηκε
 */
router.delete('/appointments/:id', deleteAppointment);

// ==========================================
// SERVICES (Υπηρεσίες)
// ==========================================

/**
 * @swagger
 * /api/admin/services:
 *   get:
 *     summary: Λήψη όλων των υπηρεσιών (admin)
 *     tags: [Admin - Services]
 *     responses:
 *       200:
 *         description: Λίστα υπηρεσιών
 */
router.get('/services', getAllServices);

/**
 * @swagger
 * /api/admin/services:
 *   post:
 *     summary: Δημιουργία νέας υπηρεσίας (admin)
 *     tags: [Admin - Services]
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
 */
router.post('/services', createService);

/**
 * @swagger
 * /api/admin/services/{id}:
 *   put:
 *     summary: Ενημέρωση μιας υπηρεσίας (admin)
 *     tags: [Admin - Services]
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
 */
router.put('/services/:id', updateService);

/**
 * @swagger
 * /api/admin/services/{id}:
 *   delete:
 *     summary: Διαγραφή μιας υπηρεσίας (admin)
 *     tags: [Admin - Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Η υπηρεσία διαγράφηκε
 */
router.delete('/services/:id', deleteService);

// ==========================================
// EMPLOYEES (Αισθητικοί)
// ==========================================

/**
 * @swagger
 * /api/admin/employees:
 *   get:
 *     summary: Λήψη όλων των αισθητικών (admin)
 *     tags: [Admin - Employees]
 *     responses:
 *       200:
 *         description: Λίστα αισθητικών
 */
router.get('/employees', getAllEmployees);

/**
 * @swagger
 * /api/admin/employees:
 *   post:
 *     summary: Δημιουργία νέου αισθητικού (admin)
 *     tags: [Admin - Employees]
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
 */
router.post('/employees', createEmployee);

/**
 * @swagger
 * /api/admin/employees/{id}:
 *   put:
 *     summary: Ενημέρωση μιας αισθητικού (admin)
 *     tags: [Admin - Employees]
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
 */
router.put('/employees/:id', updateEmployee);

/**
 * @swagger
 * /api/admin/employees/{id}:
 *   delete:
 *     summary: Διαγραφή μιας αισθητικού (admin)
 *     tags: [Admin - Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Η αισθητικός διαγράφηκε
 */
router.delete('/employees/:id', deleteEmployee);

module.exports = router;