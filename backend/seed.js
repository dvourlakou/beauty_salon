const { sequelize } = require('./models');
const { User, ServiceCategory, Service, Employee, Appointment } = require('./models');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
    try {
        // Καθαρίζω τη βάση
        await sequelize.sync({ force: true });

        // 1. Ίδιος κωδικός για test
        const hashedPassword = await bcrypt.hash('123456', 10);

        // 2.Φτιάχνω τον  ADMIN
        const adminUser = await User.create({
            name: 'Admin Salon',
            email: 'admin@salon.com',
            phone: '2100000000',
            password: hashedPassword,
            role: 'ADMIN'
        });

        // 3. Φτιάχνω αρχικούς Πελάτες
        const User1 = await User.create({
            name: 'Γιώργος Σακκάς',
            email: 'george@example.com',
            phone: '6911111111',
            password: hashedPassword,
            role: 'USER'
        });

        const User2 = await User.create({
            name: 'Κατερίνα Ράλλη',
            email: 'kath@example.com',
            phone: '6922222222',
            password: hashedPassword,
            role: 'USER'
        });

        // 4. Φτιάχνω Κατηγορίες
        const categories = await ServiceCategory.bulkCreate([
            { name: 'Περιποίηση Νυχιών', description: 'Μανικιούρ και Πεντικιούρ' },
            { name: 'Αποτρίχωση', description: 'Αποτρίχωση με κερί' },
            { name: 'Μασάζ', description: 'Μασάζ χαλάρωσης' },
        ]);

        // 5.Υπηρεσιες ανά κατηγορία
        const nailServices = await Service.bulkCreate([
            { name: 'Μανικιούρ - Απλό', price: 18, categoryId: categories[0].id, durationMinutes: 30 },
            { name: 'Μανικιούρ - Γαλλικό', price: 20, categoryId: categories[0].id, durationMinutes: 30 },
            { name: 'Μανικιούρ - Ημιμόνιμο', price: 25, categoryId: categories[0].id, durationMinutes: 45 },
            { name: 'Πεντικιούρ - Απλό', price: 22, categoryId: categories[0].id, durationMinutes: 40 },
            { name: 'Πεντικιούρ - Γαλλικό', price: 25, categoryId: categories[0].id, durationMinutes: 45 },
            { name: 'Πεντικιούρ - Ημιμόνιμο', price: 30, categoryId: categories[0].id, durationMinutes: 50 },
        ]);

        const waxingServices = await Service.bulkCreate([
            { name: 'Αποτρίχωση - Μπικίνι', price: 40, categoryId: categories[1].id, durationMinutes: 20 },
            { name: 'Αποτρίχωση - Χέρια', price: 20, categoryId: categories[1].id, durationMinutes: 15 },
        ]);

        const massageServices = await Service.bulkCreate([
            { name: 'Μασάζ - Full Body 60\'', price: 28, categoryId: categories[2].id, durationMinutes: 60 },
            { name: 'Μασάζ - Πλάτη 30\'', price: 15, categoryId: categories[2].id, durationMinutes: 30 },
        ]);


        // 6. Φτιάνω τα login των ασθητικών
        const employeesData = [
            { name: 'Αισθητικός 1', email: 'emp1@salon.com', phone: '6933333331', specialization: 'NAIL' },
            { name: 'Αισθητικός 2', email: 'emp2@salon.com', phone: '6933333332', specialization: 'NAIL' },
            { name: 'Αισθητικός 3', email: 'emp3@salon.com', phone: '6933333333', specialization: 'WAXING' },
            { name: 'Αισθητικός 4', email: 'emp4@salon.com', phone: '6933333334', specialization: 'WAXING' },
            { name: 'Αισθητικός 5', email: 'emp5@salon.com', phone: '6933333335', specialization: 'MASSAGE' },
            { name: 'Αισθητικός 6', email: 'emp6@salon.com', phone: '6933333336', specialization: 'MASSAGE' },
        ];

        const createdEmployees = [];

        for (const emp of employeesData) {
            const user = await User.create({
                name: emp.name,
                email: emp.email,
                phone: emp.phone,
                password: hashedPassword,
                role: 'EMPLOYEE'
            });

            const newEmployee = await Employee.create({
                name: emp.name,
                specialization: emp.specialization,
                userId: user.id
            });

            createdEmployees.push(newEmployee);
        }


        // 7.Αισθητικοί ανά ειδικότητα
        const nailEmployees = createdEmployees.filter(e => e.specialization === 'NAIL');
        const waxingEmployees = createdEmployees.filter(e => e.specialization === 'WAXING');
        const massageEmployees = createdEmployees.filter(e => e.specialization === 'MASSAGE');

        // 8. Αντιστοίχιση Υπηρεσιών με Αισθητικούς
        for (const service of nailServices) {
            await service.addEmployees(nailEmployees);
        }

        for (const service of waxingServices) {
            await service.addEmployees(waxingEmployees);
        }

        for (const service of massageServices) {
            await service.addEmployees(massageEmployees);
        }

        // 8. Ολοκληρωμένα test ραντεβού
        // Περιλαμβάνει όλα τα απαραίτητα πεδία (userId, employeeId, serviceId, κτλ.)
        const today = new Date().toISOString().split('T')[0];

        await Appointment.bulkCreate([
            {
                date: today,
                time: '10:00',
                status: 'COMPLETED',
                customerName: User1.name,
                customerEmail: User1.email,
                phone: User1.phone,
                price: nailServices[0].price,
                durationMinutes: nailServices[0].durationMinutes,
                userId: User1.id,
                employeeId: createdEmployees[0].id,   
                serviceId: nailServices[0].id
            },
            {
                date: today,
                time: '12:00',
                status: 'CONFIRMED',
                customerName: User2.name,
                customerEmail: User2.email,
                phone: User2.phone,
                price: massageServices[5].price,
                durationMinutes: massageServices[5].durationMinutes,
                userId: User2.id,
                employeeId: createdEmployees[4].id,   
                serviceId: massageServices[5].id
            },
            {
                date: today,
                time: '15:00',
                status: 'PENDING',
                customerName: 'Δήμητρα Βουρλάκου',
                customerEmail: 'dimitra@example.com',
                phone: '6944444444',
                price: waxingServices[3].price,
                durationMinutes: waxingServices[3].durationMinutes,
                userId: null,
                serviceId: waxingServices[3].id
            }
        ]);

        console.log('Database seeded successfully with users, services, employees, and initial appointments!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

void seedDatabase();