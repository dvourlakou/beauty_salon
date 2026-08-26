const express = require('express');
const {register,login} = require('../controllers/authController');

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:

 */

router.post('/register', register);


/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Σύνδεση χρήστη
 *     tags: [Auth]
 *        requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                required:
 *                  -email:
 *                  -password:
 *                properties:
 *                  email:
 *                    type: string
 *                    example: user@example.com
 *                  password:
 *                    type: string
 *                    example: "123456"
 *        responses:
 *          200:
 *            description: Επιτυχής σύνδεση
 *              content:
 *                application/json:
 *                  schema:
 *                    type: object
 *                    properties:
 *                      token:
 *                        type: string
 *                      user:
 *                        type: object
 *           401:
 *             description: Λάθος email ή κωδικός
 */

router.post('/login', login);

module.exports = router;
