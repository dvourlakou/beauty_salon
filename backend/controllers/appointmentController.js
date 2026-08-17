const { Appointment, Service, Employee , User} = require('../models');
const {Op} = require('sequelize');

//Δημιουργία ραντεβού(για συνδεδεμένο χρήστη)
const createAppointment = async (req,res) => {
    try {
        const {serviceId, employeeId, date, time, notes} = req.body;
        const customerId = req.user.id; // από το auth middleware

        //Βρίσκω την υπηρεσία για να δω αντίστοιχη τιμή και διάρκεια
        const service = await Service.findByPk(serviceId);
        if (!service) {
            return req.status(404).json({message: 'Η υπηρεσία δε βρέθηκε'});
        }

        //Ελέγχω αν ο/η αισθητικός είναι διαθέσιμος/η
        const existingAppointment = await Appointment.findOne({
            employeeId,
            date,
            time,
            status: {[Op.not]: 'CANCELLED'},
        });
        if (existingAppointment) {
            return res.status(400).json({message: 'Ο/Η αισθητικός δεν είναι διαθέσιμος/η αυτή την ώρα'});
        }

        //Δημιουργία ραντεβού
        const appointment = await Appointment.create({
            customerId,
            serviceId,
            employeeId,
            date,
            time,
            durationMinutes: service.durationMinutes || 30,
            price: service.price,
            notes,
            status: 'PENDING',
        });

        //Φόρτωση των δεδομένων για την απάντηση
        const appointmentWithDetails = await Appointment.findByPk(appointment.id, {
            include: [
                {model: Service},
                {model: Employee},
                {model: User, as: 'Customer'},
            ]
        });

        res.status(201).json(appointmentWithDetails);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({message:' Παρουσιάστηκε σφάλμα κατά τη δημιουργία του ραντεβού'});
    }
};

//Λήψη ραντεβού για χρήστη που είναι συνδεδεμένος
const getMyAppointment = async (req,res) => {
    try {
        const customerId =req.user.id;
        const appointments = await Appointment.findAll({
            where: {customerId},
            include: [
                {model:Service},
                {model:Employee},
            ],
            order: [['date', 'DESC']],
        });
        res.status(200).json(appointments);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({message:' Παρουσιάστηκε σφάλμα κατά τη λήψη των ραντεβού'});
    }
};

//Ακύρωση ραντεβού
const cancelAppointment = async (req,res) => {
    try {
        const {id} = req.params;
        const customerId = req.user.id;

        const appointment = await Appointment.findOne({
            where: {id,customerId},
        });
        if (!appointment) {
            return res.status(400).json({message: 'Το ραντεβού δε βρέθηκε'});
        }
        if (appointment.status === 'COMPLETED') {
            return res.status(400).json({message: 'Δεν μπορείτε να ακυρώσετε ένα ραντεβού που έχει ολοκληρωθεί'});
        }

        appointment.status = 'CANCELLED';
        await  appointment.save();

        res.status(200).json({message: 'Το ραντεβού ακυρώθηκε επιτυχώς'});
    }
    catch (error) {
        console.error(error);
        res.status(500).json({message:' Παρουσιάστηκε σφάλμα κατά τη ακύρωση του ραντεβού'});
    }
};

module.exports = {createAppointment, getMyAppointment, cancelAppointment};
