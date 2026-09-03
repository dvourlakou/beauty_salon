const { Appointment, Service, Employee , User} = require('../models');
const {Op} = require('sequelize');


//Λήψη διαθέσιμων ωρών
const getAvailableSlots = async (req,res) => {
    try {
        const {serviceId, date,employeeId} = req.query;
        if (!serviceId || !date) {
            return res.status(400).json({message: 'Απαιτούνται τα serviceId Και date'});
        }
        //Πιθανά slots του καταστήματος
        const possibleSlots = [
            '11:00', '12:00', '13:00', '14:00','15:00', '16:00', '17:00', '18:00', '19:00'
        ];

        //Ποιά ρατεβού είναι ήδη κλεισμένα
        const whereClause = {
                serviceId,
                date,
                status: {[Op.not]: 'CANCELLED'}
        };
        
        //Αν ο χρήστης επιλέξει συγκεκριμένο υπάλληλο
        if (employeeId) {
            whereClause.employeeId = employeeId;
        }

        const bookedAppointments = await Appointment.findAll({
            where: whereClause,
            attributes: ['time','employeeId']
        });

        //Αν δεν έχει επιλεγεί συγεκριμένος αισθητικός, ενα slot θεωρείται μη διαθέσιμο αν και οι δυο
        //εργαζόμενοι είναι κλεισμένοι τη συγκεκριμένη ώρα
        let bookedTimes = [];

        if (employeeId) {
            bookedTimes = bookedAppointments.map(app > app.time);
        } else {
            const service = await Service.findByPk(serviceId, {
                include: [{model: Employee, as: 'Employees', where: {isActive:true}, required: false}]
            });
            const totalEmployees = (service && service.Employees) ? service.Employees.length : 2;
            
            cosnt timeCounts = {};
            bookedAppointments.forEach(app => {
                timeCounts[app.time] = (timeCounts[app.time] || 0) + 1 ;
            });

            //κλείνω την ώρα μόνο αν όλοι οι διαθέσιμοι υπάλληλοι εχουν ραντεβού
            bookedTimes = Object.keys(timeCounts).filter(time => timeCounts[time] >= totalEmployees);
        
        }

        const availableSlots = possibleSlots.filter(slot => !bookedTimes.includes(slot));
        res.status(200).json(availableSlots);
    }
    catch (error) {
        console.error('Error fetching available slots:', error);
        res.status(500).json({message: 'Παρουσιάστηκε σφάλμα κατά τη λήψη των διαθέσιμων ωρών'});
    }
};

//Δημιουργία ραντεβού(για συνδεδεμένο χρήστη)
const createAppointment = async (req,res) => {
    try {
        let {serviceId, employeeId, date, time, notes} = req.body;
        const customerId = req.user.id; // από το auth middleware

        //Βρίσκω την υπηρεσία για να δω αντίστοιχη τιμή και διάρκεια
        const service = await Service.findByPk(serviceId , {
            include: [{
                model: Employee,
                as: 'Employees',
                where: {isActive: true},
                through: {attributes: []},
                required: false
            }]
        });

        if (!service) {
            return res.status(404).json({message: 'Η υπηρεσία δε βρέθηκε'});
        }

        //Αυτόματη ανάθεση αν το employeeId είναι null / undefined
        if (!employeeId) {
            const assignedEmployees = service.Employees || await Employee.findAll({where: {isActive: true}});

            if (!assignedEmployees || assignedEmployees.length === 0) {
                return res.status(400).json({ message: 'Δε βρέθηκε διαθέσιμος εργαζόμενος για τη συγκεκριμένη υπηρεσία'});
            }

            //Ελέγχω εργαζομένους
            for (const emp of assignedEmployees) {
                const existingApp = await Appointment.findOne({
                    where: {
                        employeeId: emp.id,
                        date,
                        time,
                        status: {[Op.not]: 'CANCELLED'}
                    }
                });

                if (!existingApp) {
                    employeeId =emp.id;
                    break;
                }
            }

                if (!employeeId) {
                    return res.status(400).json({message: 'Όλοι οι αισθητικοί είναι απασχολημέοι τη συγκεκριμένη ώρα'})
                } else {
                     const existingAppointment = await Appointment.findOne({
                         where: {
                           employeeId,
                           date,
                           time,
                           status: {[Op.not]: 'CANCELLED'}
                        }
                    });
                    
                    if (existingAppointment) {
                        return res.status(400).json({message: 'Ο/Η αισθητικός δεν είναι διαθέσιμος/η αυτή την ώρα'});
                    }
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

module.exports = {createAppointment, getMyAppointment, cancelAppointment,getAvailableSlots};
