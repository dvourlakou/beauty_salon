const express = require('express');
const {createAppointment, getMyAppointment, cancelAppointment} = require('../controllers/appointmentController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();


//Όλα τα routes χρειάζονται authentication
router.use(authMiddleware);

router.post('/', createAppointment);
router.get('/my', getMyAppointment);
router.delete('/.id', cancelAppointment);

module.exports = router;