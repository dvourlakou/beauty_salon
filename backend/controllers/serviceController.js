const {ServiceCategory,Service} = require('../models');

//λήψη όλων των κατηγοριών με τις υπηρεσίες τους
const getAllCategories = async (req,res) => {
    try {
        res.status(200).json([
            { id:1, name: 'Περιποίηση Νυχιών',
                Services: [{ id: '1', name: 'Μανικιουρ/Πεντικιούρ', price: 25, categoryId: '1'}]},
            { id:2, name: 'Αποτρίχωση',
                Services: [{ id: '2', name: 'Αποτρίχωση', price: 25, categoryId: '2'}]},
            { id:3, name: 'Μασάζ',
                Services: [{ id: '3', name: 'Μασάζ', price: 25, categoryId: '3'}]}
        ]);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({message: 'Σφάλμα κατά τη λήψη των κατηγοριών'});
    }

};

const getAllServices = async (req,res) => {
    try {
        res.status(200).json([
            { id:'1', name: 'Περιποίηση Νυχιών', price:25, categoryId:'1'},
            { id:'2', name: 'Αποτρίχωση', price : 40, categoryId: '2'},
            { id:'3', name: 'Μασάζ', price :30, categoryId: '3'}
        ]);
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
        const service = await Service.findByPk(id);
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
