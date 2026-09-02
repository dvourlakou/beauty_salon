const { sequelize } = require('./models');
const { User,ServiceCategory, Service, Employee } = require('./models');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
    try {
        //Αρχικός καθαρισμός και συγχρονισμός της βάσης
        await sequelize.sync({force: true});

        //1.Κοινός κωδικός για testing accounts
        const hashedPassword = await bcrypt.hash('123456', 10);

        //2.Δημιουργία του χρήστη ADMIN
        await User.create({
            name: 'Admin Salon',
            email: 'admin@salon.com',
            password: hashedPassword,
            role: 'ADMIN'
        });


        // 3.Δημιουργία Κατηγοριών
        const categories = await ServiceCategory.bulkCreate([
            { name: 'Περιποίηση Νυχιών', description: 'Μανικιούρ και Πεντικιούρ' },
            { name: 'Αποτρίχωση', description: 'Αποτρίχωση με κερί' },
            { name: 'Μασάζ', description: 'Μασάζ χαλάρωσης' },
        ]);

        // 4.Δημιουργία Υπηρεσιών
        await Service.bulkCreate([
            { name: 'Μανικιούρ - Απλό', price: 18, categoryId: 1, durationMinutes: 30 },
            { name: 'Μανικιούρ - Γαλλικό', price: 20, categoryId: 1, durationMinutes: 30 },
            { name: 'Μανικιούρ - Ημιμόνιμο', price: 25, categoryId: 1, durationMinutes: 45 },
            { name: 'Αποτρίχωση - Μπικίνι', price: 40, categoryId: 2, durationMinutes: 20 },
            { name: 'Αποτρίχωση - Χέρια', price: 20, categoryId: 2, durationMinutes: 15 },
            { name: 'Μασάζ - Full Body 60\'', price: 28, categoryId: 3, durationMinutes: 60 },
            { name: 'Μασάζ - Πλάτη 30\'', price: 15, categoryId: 3, durationMinutes: 30 },
        ]);

        // 5.Δημιουργία Εργαζομένων και αντίστοιχων users για Login
        const employeesData =[
            { name: 'Αισθητικός 1', email: 'emp1@salon.com' , specialization: 'NAIL' },
            { name: 'Αισθητικός 2', email: 'emp2@salon.com' , specialization: 'NAIL' },
            { name: 'Αισθητικός 3', email: 'emp3@salon.com' , specialization: 'WAXING' },
            { name: 'Αισθητικός 4', email: 'emp4@salon.com' , specialization: 'WAXING' },
            { name: 'Αισθητικός 5', email: 'emp5@salon.com' , specialization: 'MASSAGE' },
            { name: 'Αισθητικός 6', email: 'emp6@salon.com' , specialization: 'MASSAGE' },
        ];

        for (const emp of employeesData) {
            //δημιουργία user Λογαριασμού
            const  user = await User.create({
                name: emp.name,
                email: emp.email,
                password: hashedPassword,
                role: 'EMPLOYEE'
            });

            await Employee.create ({
                name: emp.name,
                specialization: emp.specialization,
                userId: user.id
            });
        }

        console.log('✅ Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

void seedDatabase();