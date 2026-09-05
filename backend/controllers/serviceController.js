const {ServiceCategory,Service} = require('../models');

//λήψη όλων των κατηγοριών με τις υπηρεσίες τους
const getAllCategories = async (req,res) => {
    try {
        const categories = await ServiceCategory.findAll({
            include: [{
                model: Service,
                as: 'services'}],
        });
        res.status(200).json(categories);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({message: 'Σφάλμα κατά τη λήψη των κατηγοριών'});
    }

};

const getAllServices = async (req,res) => {
    try {
        const services = await Service.findAll({
            include: [{
                model: ServiceCategory,
                as: 'category'
            }]
        });
        res.status(200).json(services);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({message: 'Σφάλμα κατά τη λήψη των υπηρεσιών'});
    }

};

//λήψη μιας συγκεκριμένης υπηρεσίας
const getServiceById = async (req,res) => {
    try {
        const {id} = req.params;
        const service = await Service.findByPk(id, {
            include: [{
                model: ServiceCategory,
                as: 'category'
            }]
        });
        if (!service) {
            return res.status(404).json({message: 'Η υπηρεσία δε βρέθηκε'});
        }
        res.status(200).json(service);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({message: 'Παρουσιάστηκε σφάλμα κατά τη λήψη της υπηρεσίας'});
    }
};

module.exports = {getAllCategories,getAllServices,getServiceById};
