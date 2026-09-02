const {Employee, Service} = require('../models');

//Λήψη των ενεργών υπαλλήλων
const getAllEmployees = async (req,res) => {
    try {
        const employees = await Employee.findAll({
            where: {isActive: true}
        });
        res.status(200).json(employees);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({message: 'Παρουσιάστηκε σφάλμα κατά τη λήψη των υπαλλήλων'});
    }
};

//Λήψη υπαλλήλων με βάσει το serviceId
const getEmployeesByService = async (req,res) => {
    try {
        const {serviceId} = req.params;

        //Αν Employee.belongsToMany(Service) τοτε
        const service = await Service.findByPk(serviceId, {
            include: [{ model: Employee, where: { isActive: true}, required: false}]
        });

        if (!service) {
            return res.status(404).json({message: 'Η υπηρεσία δε βρέθηκε'});
        }

        //Αν δεν έχει δημιουργηθεί ακόμα η σχέση επιστρέφω όλους τους ενεργούς
        const employees = service.Employee || await Employee.findAll({where: {isActive: true}});
        res.status(200).json(employees);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({message: 'Παρουσιάστηκε σφάλμα κατά τη λήψη των υπαλλήλων για την υπηρεσία'});
    }
};

module.exports = {getAllEmployees,getEmployeesByService};
