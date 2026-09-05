const { User, ServiceCategory, Service, Employee, Appointment } = require('../models');
const { Op } = require('sequelize');

// ==========================================
// 1. ΣΤΑΤΙΣΤΙΚΑ DASHBOARD & ΡΑΝΤΕΒΟΥ
// ==========================================

const getStats = async (req, res) => {
    try {
        const total = await Appointment.count();

        const todayStr = new Date().toISOString().split('T')[0];
        const today = await Appointment.count({
            where: { date: todayStr }
        });

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const thisWeek = await Appointment.count({
            where: {
                createdAt: {
                    [Op.gte]: sevenDaysAgo
                }
            }
        });

        const pending = await Appointment.count({
            where: { status: 'PENDING' }
        });

        res.status(200).json({ total, today, thisWeek, pending });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Παρουσιάστηκε σφάλμα κατά τη λήψη των στατιστικών' });
    }
};

// Λήψη όλων των ραντεβού (Για τη σελίδα AdminAppointments.tsx)
const getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.findAll({
            include: [
                { model: User,as : 'customer', attributes: ['id', 'name', 'email'] },
                { model: Employee,as: 'employee', attributes: ['id', 'name', 'specialization'] },
                { model: Service,as : 'service', attributes: ['id', 'name', 'price', 'durationMinutes'] }
            ],
            order: [['date', 'DESC'], ['time', 'DESC']]
        });
        res.status(200).json(appointments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Παρουσιάστηκε σφάλμα κατά τη λήψη των ραντεβού' });
    }
};

const getWeeklyAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.findAll({
            include: [
                { model: User, as: 'customer', attributes: ['id', 'name', 'email'] },
                { model: Employee,as: 'employee', attributes: ['id', 'name'] },
                { model: Service,as: 'service', attributes: ['id', 'name', 'price'] }
            ],
            order: [['date', 'ASC'], ['time', 'ASC']]
        });
        res.status(200).json(appointments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Παρουσιάστηκε σφάλμα κατά τη λήψη των εβδομαδιαίων ραντεβού' });
    }
};

const getEmployeeWorkload = async (req, res) => {
    try {
        const employees = await Employee.findAll({
            include: [{ model: Appointment, as: 'appointments' }]
        });

        const workload = employees.map(emp => ({
            id: emp.id,
            name: emp.name,
            appointmentCount: emp.appointments ? emp.Appointments.length : 0
        }));
        res.status(200).json(workload);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Παρουσιάστηκε σφάλμα κατά τη λήψη του φόρτου εργασίας' });
    }
};

const updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Μη έγκυρη κατάσταση ραντεβού' });
        }

        const appointment = await Appointment.findByPk(id);
        if (!appointment) {
            return res.status(404).json({ message: 'Το ραντεβού δε βρέθηκε' });
        }

        await appointment.update({ status });
        res.status(200).json({ message: 'Η κατάσταση του ραντεβού ενημερώθηκε επιτυχώς', appointment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Παρουσιάστηκε σφάλμα κατά την ενημέρωση του ραντεβού' });
    }
};

const completeAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const appointment = await Appointment.findByPk(id);
        if (!appointment) {
            return res.status(404).json({ message: 'Το ραντεβού δε βρέθηκε' });
        }
        await appointment.update({ status: 'COMPLETED' });
        res.status(200).json({ message: 'Το ραντεβού ολοκληρώθηκε' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Παρουσιάστηκε σφάλμα κατά την ενημέρωση ραντεβού' });
    }
};

const deleteAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const appointment = await Appointment.findByPk(id);

        if (!appointment) {
            return res.status(404).json({ message: 'Το ραντεβού δε βρέθηκε' });
        }

        await appointment.destroy();
        res.status(200).json({ message: 'Το ραντεβού διαγράφηκε επιτυχώς' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Παρουσιάστηκε σφάλμα κατά τη διαγραφή του ραντεβού' });
    }
};

// ==========================================
// 2. ΔΙΑΧΕΙΡΙΣΗ ΥΠΗΡΕΣΙΩΝ (CRUD)
// ==========================================

const getAllServices = async (req, res) => {
    try {
        const categories = await ServiceCategory.findAll({
            include: [{ model: Service, as: 'Services' }]
        });
        res.status(200).json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Παρουσιάστηκε σφάλμα κατά τη λήψη των υπηρεσιών' });
    }
};

const createService = async (req, res) => {
    try {
        const { name, price, categoryId, durationMinutes, description } = req.body;
        const service = await Service.create({
            name,
            price,
            categoryId,
            durationMinutes,
            description,
            isActive: true
        });
        res.status(201).json(service);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Παρουσιάστηκε σφάλμα κατά τη δημιουργία της υπηρεσίας' });
    }
};

const updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, durationMinutes, description, isActive } = req.body;
        const service = await Service.findByPk(id);
        if (!service) {
            return res.status(404).json({ message: 'Η υπηρεσία δε βρέθηκε' });
        }
        await service.update({ name, price, durationMinutes, description, isActive });
        res.status(200).json(service);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Παρουσιάστηκε σφάλμα κατά την ενημέρωση' });
    }
};

const deleteService = async (req, res) => {
    try {
        const { id } = req.params;
        const service = await Service.findByPk(id);
        if (!service) {
            return res.status(404).json({ message: 'Η υπηρεσία δε βρέθηκε' });
        }
        await service.destroy();
        res.status(200).json({ message: 'Η υπηρεσία διαγράφηκε' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Παρουσιάστηκε σφάλμα κατά τη διαγραφή' });
    }
};

// ==========================================
// 3. ΔΙΑΧΕΙΡΙΣΗ ΑΙΣΘΗΤΙΚΩΝ (CRUD)
// ==========================================

const getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.findAll();
        res.status(200).json(employees);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Παρουσιάστηκε σφάλμα κατά τη λήψη αισθητικών' });
    }
};

const createEmployee = async (req, res) => {
    try {
        const { name, specialization } = req.body;
        const employee = await Employee.create({ name, specialization, isActive: true });
        res.status(201).json(employee);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Παρουσιάστηκε σφάλμα κατά τη δημιουργία αισθητικού' });
    }
};

const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, specialization, isActive } = req.body;
        const employee = await Employee.findByPk(id);
        if (!employee) {
            return res.status(404).json({ message: 'Ο/Η αισθητικός δε βρέθηκε' });
        }
        await employee.update({ name, specialization, isActive });
        res.status(200).json(employee);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Παρουσιάστηκε σφάλμα κατά την ενημέρωση' });
    }
};

const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await Employee.findByPk(id);
        if (!employee) {
            return res.status(404).json({ message: 'Ο/Η αισθητικός δε βρέθηκε' });
        }
        await employee.destroy();
        return res.status(200).json({ message: 'Ο/Η αισθητικός διαγράφηκε' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Παρουσιάστηκε σφάλμα κατά τη διαγραφή' });
    }
};

module.exports = {
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
};