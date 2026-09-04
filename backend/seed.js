const { sequelize } = require('./models');
const { User, ServiceCategory, Service, Employee, Appointment } = require('./models');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
    try {
        // Αρχικός καθαρισμός και συγχρονισμός της βάσης
        await sequelize.sync({ force: true });

        // 1. Κοινός κωδικός για testing accounts
        const hashedPassword = await bcrypt.hash('123456', 10);

        // 2. Δημιουργία του χρήστη ADMIN
        const adminUser = await User.create({
            name: 'Admin Salon',
            email: 'admin@salon.com',
            phone: '2100000000',
            password: hashedPassword,
            role: 'ADMIN'
        });

        // 3. Δημιουργία Πελατών 
        const clientUser1 = await User.create({
            name: 'Μαρία Παπαδοπούλου',
            email: 'maria@example.com',
            phone: '6911111111',
            password: hashedPassword,
            role: 'CLIENT'
        });

        const clientUser2 = await User.create({
            name: 'Ελένη Γεωργίου',
            email: 'eleni@example.com',
            phone: '6922222222',
            password: hashedPassword,
            role: 'CLIENT'
        });

        // 4. Δημιουργία Κατηγοριών
        const categories = await ServiceCategory.bulkCreate([
            { name: 'Περιποίηση Νυχιών', description: 'Μανικιούρ και Πεντικιούρ' },
            { name: 'Αποτρίχωση', description: 'Αποτρίχωση με κερί' },
            { name: 'Μασάζ', description: 'Μασάζ χαλάρωσης' },
        ]);

        // 5. Δημιουργία Υπηρεσιών 
        const services = await Service.bulkCreate([
            { name: 'Μανικιούρ - Απλό', price: 18, categoryId: categories[0].id, durationMinutes: 30 },
            { name: 'Μανικιούρ - Γαλλικό', price: 20, categoryId: categories[0].id, durationMinutes: 30 },
            { name: 'Μανικιούρ - Ημιμόνιμο', price: 25, categoryId: categories[0].id, durationMinutes: 45 },
            { name: 'Αποτρίχωση - Μπικίνι', price: 40, categoryId: categories[1].id, durationMinutes: 20 },
            { name: 'Αποτρίχωση - Χέρια', price: 20, categoryId: categories[1].id, durationMinutes: 15 },
            { name: 'Μασάζ - Full Body 60\'', price: 28, categoryId: categories[2].id, durationMinutes: 60 },
            { name: 'Μασάζ - Πλάτη 30\'', price: 15, categoryId: categories[2].id, durationMinutes: 30 },
        ]);

        // 6. Δημιουργία Εργαζομένων και αντίστοιχων users για Login
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
            // Δημιουργία user λογαριασμού
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

        // Σύνδεση υπηρεσιών με αισθητικούς με βάση την ειδικότητά τους
        // Περιποίηση Νυχιών -- αισθητικοί 1 και 2
        const nailServices = services.filter(s => s.categoryId === categories[0].id);
        const nailEmployees = createdEmployees.filter(e => e.specialization === 'NAIL');
        for (const service of nailServices) {
            await service.addEmployees(nailEmployees);
        }

        // Αποτρίχωση -- αισθητικοί 3 και 4
        const waxingServices = services.filter(s => s.categoryId === categories[1].id);
        const waxingEmployees = createdEmployees.filter(e => e.specialization === 'WAXING'); 
        for (const service of waxingServices) {
            await service.addEmployees(waxingEmployees);
        }

        // Μασάζ -- αισθητικοί 5 και 6
        const massageServices = services.filter(s => s.categoryId === categories[2].id);
        const massageEmployees = createdEmployees.filter(e => e.specialization === 'MASSAGE'); 
        for (const service of massageServices) {
            await service.addEmployees(massageEmployees);
        }

        // 7. Δημιουργία Δοκιμαστικών Ραντεβού (Appointments)
        // Περιλαμβάνει όλα τα απαραίτητα πεδία (userId, employeeId, serviceId, κτλ.)
        const today = new Date().toISOString().split('T')[0];

        await Appointment.bulkCreate([
            {
                date: today,
                time: '10:00',
                status: 'COMPLETED',
                customerName: clientUser1.name,
                customerEmail: clientUser1.email,
                phone: clientUser1.phone,
                price: services[0].price,           
                durationMinutes: services[0].durationMinutes, 
                userId: clientUser1.id,
                employeeId: createdEmployees[0].id,   
                serviceId: services[0].id
            },
            {
                date: today,
                time: '12:00',
                status: 'CONFIRMED',
                customerName: clientUser2.name,
                customerEmail: clientUser2.email,
                phone: clientUser2.phone,
                price: services[5].price,             
                durationMinutes: services[5].durationMinutes, 
                userId: clientUser2.id,
                employeeId: createdEmployees[4].id,   
                serviceId: services[5].id
            },
            {
                date: today,
                time: '15:00',
                status: 'PENDING',
                customerName: 'Δήμητρα Βουρλάκου',
                customerEmail: 'dimitra@example.com',
                phone: '6944444444',
                price: services[3].price,             
                durationMinutes: services[3].durationMinutes, 
                userId: null,                         
                serviceId: services[3].id
            }
        ]);

        console.log('✅ Database seeded successfully with users, services, employees, and initial appointments!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

void seedDatabase();