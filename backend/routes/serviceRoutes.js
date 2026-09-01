const express = require('express');
const {getAllCategories,getServiceById} = require('../controllers/serviceController');

const router = express.Router();

/**
 * @swagger
 * /api/services/categories:
 *   get:
 *     summary: Λήψη όλων των κατηγοριών με τις υπηρεσίες τους
 *     responses:
 *       200:
 *         description: Λίστα κατηγοριών
 */


router.get('/categories', getAllCategories);

/**
 * @swagger
 * /api/services/{id}:
 *   get:
 *     summary: Λήψη μιας υπηρεσίας με το ID της
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Λεπτομέρειες της υπηρεσίας
 *       400:
 *         description: Η υπηρεσία δε βρέθηκε
 *
 */

router.get('/:id', getServiceById);

module.exports = router;