const express = require('express');
const {createAppointment, getMyAppointment, cancelAppointment} = require('../controllers/appointmentController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();


//Όλα τα routes χρειάζονται authentication
router.use(authMiddleware);

/**
 * @swagger
 * /api/appointments:
 *   post:
 *     summary: Δημιουργία νέου ραντεβού
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - serviceId
 *               - employeeId
 *               - date
 *               - time
 *             properties:
 *               serviceId:
 *                 type: integer
 *               employeeId:
 *                 type: integer
 *               date:
 *                 type: string
 *               time:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Το ραντεβού δημιουργήθηκε με επιτυχία
 *       400:
 *         description: Ο αισθητικός δεν είναι διαθέσιμος
 *       401:
 *         description: Απαιτείται σύνδεση
 */


router.post('/', createAppointment);

/**
 * @swagger
 * /api/appointments/my:
 *   get:
 *     summary: Λήψη των ραντεβού του συνδεδεμένου χρήστη
 *     responses:
 *       200:
 *         description: Λίστα ραντεβού
 *       401:
 *         description: Απαιτείται σύνδεση
 */

router.get('/my', getMyAppointment);

/**
 * @swagger
 * /api/appointments/{id}:
 *   delete:
 *     summary: Ακύρωση ενός ραντεβού
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Το ραντεβού ακυρώθηκε
 *       401:
 *         description: Απαιτείται σύνδεση
 *       404:
 *         description: Το ραντεβού δε βρέθηκε
 *
 */



router.delete('/.id', cancelAppointment);

module.exports = router;