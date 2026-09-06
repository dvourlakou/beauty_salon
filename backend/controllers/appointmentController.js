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
                date: date,
                status: { [Op.not] : 'CANCELLED'}
        };
        
        //Αν ο χρήστης επιλέξει συγκεκριμένο υπάλληλο
        if (employeeId && employeeId !== 'null' && employeeId !== 'undefined' && employeeId !== '') {
            whereClause.employeeId = employeeId;
        }

        const bookedAppointments = await Appointment.findAll({
            where: whereClause,
            attributes: ['time','employeeId']
        });

        //Αν δεν έχει επιλεγεί συγεκριμένος αισθητικός, ενα slot θεωρείται μη διαθέσιμο αν και οι δυο
        //εργαζόμενοι είναι κλεισμένοι τη συγκεκριμένη ώρα
        let bookedTimes = [];

        if (employeeId && employeeId !== 'null' && employeeId !== 'undefined' && employeeId !== '') {
            bookedTimes = bookedAppointments.map(app => app.time);
        } else {
            const service = await Service.findByPk(serviceId, {
                include: [{
                    model: Employee,
                    as: 'employees',
                    where: {isActive:true},
                    required: false
                }]
            });
            const totalEmployees = (service && service.employees) ? service.employees.length : 2;
            
            const timeCounts = {};
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
        console.log("Νέο αιτημα κρατησης", {serviceId,employeeId,date,time});
        const customerId = req.user.id;

        const service = await Service.findByPk(serviceId, {
            include: [{
                model: Employee,
                as: 'employees',
                where: {isActive: true},
                through: {attributes: []},
                required: false
            }]
        });

        if (!service) {
            return res.status(404).json({message: 'Η υπηρεσία δε βρέθηκε'});
        }

        let assignedEmployees = [];
        if (service.employees && service.employees.length >0) {
            assignedEmployees = service.employees;
            console.log("Βρέθηκαν υπάλληλοι της υπηρεσίας",assignedEmployees.length);
        } else {
            console.log("Δε βρέθηκαν διαθέσιμοι υπάλληλοι")
            assignedEmployees = await Employee.findAll({where: {isActive: true}});
        }

        console.log(`Ξεκιναω τον έλεγχο για το ${assignedEmployees.length} υπαλλήλους`);

        if (!employeeId) {
            if (!assignedEmployees || assignedEmployees.length === 0) {
                console.log("Σφάλμα δε βρέθηκε υπαλληλος για την υπηρεσία");
                return res.status(400).json({message: 'Δε βρέθηκε διαθέσιμος εργαζόμενος για τη συγκεκριμένη υπηρεσία'});
            }

            //Ελέγχω εργαζομένους
            for (const emp of assignedEmployees) {
                console.log(`Ελέγχω αν ο υπάλληλος ${emp.id} είναι ελεύθερος την ώρα ${time}`);

                const existingApp = await Appointment.findOne({
                    where: {
                        employeeId: emp.id,
                        date: date,
                        time: time,
                        status: {[Op.not]: 'CANCELLED'}
                    }
                });

                if (!existingApp) {
                    employeeId = emp.id;
                    console.log(`Βρέθηκε ο υπάλληλος ${employeeId}`);
                    break;
                }
            }
        } else {

            console.log(`Ο χρήστης επέλεξε συγκεκριμένο υπάλληλο με ID: ${employeeId} `)

            const existingApp = await Appointment.findOne({
                    where: {
                        employeeId: employeeId,
                        date: date,
                        time: time,
                        status: {[Op.not]: 'CANCELLED'}
                    }
            });

            if (existingApp) {
                console.log(`Ο υπαλληλος ${employeeId} είναι ήδη απασχολημενος αυτη την ώρα`);
                return res.status(400).json({message: 'Ο/Η αισθητικός δεν είναι διαθέσιμος/η αυτή την ώρα'});
            }
            console.log("Ο υπαλληλος είναι ελέυθερος συνεχίζω");
        }

            const user = await User.findByPk(customerId);
            console.log("Έλεχος χρήστηγ ια κράτηση", user ? `Βρέθηκε ο χρήστης ${user.name}` : 'Δε βρέθηκε ο χρήστης');


            //Δημιουργία ραντεβού
            const appointment = await Appointment.create({
                userId: customerId,
                customerName: user ? user.name : '',
                customerEmail: user ? user.email : '',
                phone: user ? user.phone : '',
                serviceId,
                employeeId: employeeId,
                date: date,
                time: time,
                durationMinutes: service.durationMinutes || 30,
                price: service.price,
                notes,
                status: 'PENDING',
            });
            console.log('Το ραντεβου δημιουργήθηκε με επιτυχία στη ΒΔ');

            //Φόρτωση των δεδομένων για την απάντηση
            const appointmentWithDetails = await Appointment.findByPk(appointment.id, {
                include: [
                    {model: Service, as: 'service'},
                    {model: Employee, as: 'employee'},
                    {model: User, as: 'customer', attributes: ['id', 'name', 'email', 'phone']},
                ]
            });

            console.log("Φορτώθηκαν τα details gia το frontend:", appointmentWithDetails ? 'Επιτυχία' : 'Αποτυχία');

            res.status(201).json(appointmentWithDetails);

    }
    catch (error) {
        console.error("Σφάλμα στο backend (createAppointment ", error);
        res.status(500).json({message:' Παρουσιάστηκε σφάλμα κατά τη δημιουργία του ραντεβού'});
    }
};

//Λήψη ραντεβού για χρήστη που είναι συνδεδεμένος
const getMyAppointment = async (req,res) => {
    try {
        const userId =req.user.id || 1 ;
        const appointments = await Appointment.findAll({
            where: {userId},
            include: [
                {model:Service,as :'service'},
                {model:Employee,as:'employee'},
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
            where: {
                id: id,
                userId: customerId
            },
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
