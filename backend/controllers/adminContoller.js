const { User, ServiceCategory, Employee, Appointment } = require('../models');
const { Op } = require('sequelize');

//1. ΣΤΑΤΙΣΤΙΚΑ DASHBOARD

const getStats = async (req, res) => {
    try {
        const total = await Appointment.count();
        const today = await Appointment.count({
            where: { date: new Date().toISOString().split('T')[0]}
        });
        const thisWeek = await Appointment.count({
            where: {
                date: {
                    [Op.gte]: new Date(new Date().setDate(new Date().getDate() -7))
                }
            }
        });
        const pending = await Appointment.count({
            where: {status: 'PENDING'}
        });

        res.status(200).json({ total, today, thisWeek, pending });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({message: 'Παρουσιάστηκε σφάλμα κατά τη λήψη των στατιστικών'});
    }
};

//2. ΔΙΑΧΕΙΡΙΣΗ ΥΠΗΡΕΣΙΩΝ (CRUD)

const getAllServices = async (req, res) => {
    try {
        let Service;
        const categories = await ServiceCategory.findAll({
            include: [{ model: Service, as: 'Services'}]
        });
        res.status(200).json(categories);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({message: 'Παρουσιάστηκε σφάλμα κατά τη λήψη των υπηρεσιών'});
    }
};

const createService = async (req,res) => {
    try {
        const { name, price, categoryId, durationMinutes, description } = req.body;
        let Service;
        const service = await Service.create({
            name,
            price,
            categoryId,
            durationMinutes,
            description,
            isActive: true
        });
        res.status(201).json(service);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({message: 'Παρουσιάστηκε σφάλμα κατά τη δημιουργία της υπηρεσίας'});
    }
};

const updateService = async (req,res) => {
    try {
        const {id} = req.params;
        const {name, price, durationMinutes, description, isActive} = req.body;
        let Service;
        const service = await Service.findByPk(id);
        if (!service) {
            return res.status(404).json({message: 'Η υπηρεσία δε βρέθηκε'});
        }
        await service.update({name, price, durationMinutes, description, isActive});
        res.status(200).json(service);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({message: 'Παρουσιάστηκε σφάλμα κατά την ενημέρωση'});
    }
};

const deleteService = async (req,res) => {
    try {
        const {id} = req.params;
        let Service;
        const service = await Service.findByPk(id);
        if (!service) {
            return res.status(404).json({message: 'Η υπηρεσία δε βρέθηκε'});
        }
        await service.destroy();
        res.status(200).json({message: 'Η υπηρεσία διαγράφηκε'});
    }
    catch (error) {
        console.error(error);
        res.status(500).json({message: 'Παρουσιάστηκε σφάλμα κατά τη διαγραφή'});
    }
};

//3. ΔΙΑΧΕΙΡΙΣΗ ΑΙΣΘΗΤΙΚΩΝ (crud)

const getAllEmployees = async (req,res) => {
    try {
        const employees = await Employee.findAll();
        res.status(200).json(employees);
    }
    catch (error) {
        res.status(500).json({message: 'Παρουσιάστηκε σφάλμα κτά τη λήψη αισθητικών'});
    }
};

const createEmployee = async (req,res) => {
    try {
        const {name, specialization} = req.body;
        const employee = await Employee.create({ name, specialization, isActive: true });
        res.status(201).json(employee);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({message: 'Παρουσιάστηκε σφάλμα κατά τη δημιουργία αισθητικού'});
    }
};

const updateEmployee = async (req,res) => {
    try {
        const {id} = req.params;
        const {name,specialization,isActive} = req.body;
        const employee = await Employee.findByPk(id);
        if (!employee) {
            return res.status(404).json({message: 'Ο/Η αισθητικός δε βρέθηκε'});
        }
        await employee.update({ name,specialization,isActive });
        res.status(200).json(employee);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({message: 'Παρουσιάστηκε σφάλμα κατά την ενημέρωση'});
    }
};

const deleteEmployee = async (req,res) => {
    try {
        const {id} = req.params;
        const employee = await Employee.findByPk(id);
        if (!employee) {
            return res.status(404).json({message: 'Ο/Η αισθητικός δε βρέθηκε'});
        }
        await employee.destroy();
        return res.status(200).json({message: 'Ο/Η αισθητικός διαγράφηκε'});
    }
    catch (error) {
        console.error(error);
        res.status(500).json({message: 'Παρουσιάστηκε σφάλμα κατά τη διαγραφή'});
    }
};

module.exports = {
    getStats,
    getAllServices,
    createService,
    updateService,
    deleteService,
    getAllEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee
};



