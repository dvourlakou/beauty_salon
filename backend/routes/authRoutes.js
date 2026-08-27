const express = require('express');
const {register,login} = require('../controllers/authController');

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Εγγραφή νέου χρήστη
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - name
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Ο χρήστης εγγράφηκε με επιτυχία
 *       400:
 *         description: Το email χρησιμοποιείται ήδη
 */



router.post('/register', register);


/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Σύνδεση χρήστη
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email:
 *               - password:
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Επιτυχής σύνδεση
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *       401:
 *         description: Λάθος email ή κωδικός
 */

router.post('/login', login);

module.exports = router;
