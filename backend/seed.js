const { sequelize } = require('./models');
const { ServiceCategory, Service, Employee } = require('./models');

const seedDatabase = async () => {
    try {
        // 1. Κατηγορίες
        const categories = await ServiceCategory.bulkCreate([
            { name: 'Περιποίηση Νυχιών', description: 'Μανικιούρ και Πεντικιούρ' },
            { name: 'Αποτρίχωση', description: 'Αποτρίχωση με κερί' },
            { name: 'Μασάζ', description: 'Μασάζ χαλάρωσης' },
        ]);

        // 2. Υπηρεσίες
        await Service.bulkCreate([
            { name: 'Μανικιούρ - Απλό', price: 18, categoryId: 1, durationMinutes: 30 },
            { name: 'Μανικιούρ - Γαλλικό', price: 20, categoryId: 1, durationMinutes: 30 },
            { name: 'Μανικιούρ - Ημιμόνιμο', price: 25, categoryId: 1, durationMinutes: 45 },
            { name: 'Αποτρίχωση - Μπικίνι', price: 40, categoryId: 2, durationMinutes: 20 },
            { name: 'Αποτρίχωση - Χέρια', price: 20, categoryId: 2, durationMinutes: 15 },
            { name: 'Μασάζ - Full Body 60\'', price: 28, categoryId: 3, durationMinutes: 60 },
            { name: 'Μασάζ - Πλάτη 30\'', price: 15, categoryId: 3, durationMinutes: 30 },
        ]);

        // 3. Εργαζόμενοι
        await Employee.bulkCreate([
            { name: 'Αισθητικός 1', specialization: 'NAIL' },
            { name: 'Αισθητικός 2', specialization: 'NAIL' },
            { name: 'Αισθητικός 3', specialization: 'WAXING' },
            { name: 'Αισθητικός 4', specialization: 'WAXING' },
            { name: 'Αισθητικός 5', specialization: 'MASSAGE' },
            { name: 'Αισθητικός 6', specialization: 'MASSAGE' },
        ]);

        console.log('✅ Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

void seedDatabase();