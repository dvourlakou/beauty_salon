const { sequelize } = require('./models');
const { User, ServiceCategory, Service, Employee, Appointment } = require('./models');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
    try {
        // Καθαρίζω τη βάση
        await sequelize.sync({force: true});

        //  Ίδιος κωδικός για test
        const hashedPassword = await bcrypt.hash('123456', 10);

        //Φτιάχνω τον  ADMIN
        await User.create({
            name: 'Admin Salon',
            email: 'admin@salon.com',
            phone: '2100000000',
            password: hashedPassword,
            role: 'ADMIN'
        });

        //  Φτιάχνω αρχικούς Πελάτες
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


        const User3 = await User.create({
            name: 'Δήμητρα Βουρλάκου',
            email: 'dimitra@example.com',
            phone: '6944444444',
            password: hashedPassword,
            role: 'USER'
        });

        //  Φτιάχνω Κατηγορίες
        const categories = {
            nails: await ServiceCategory.create({
                name: 'Περιποίηση Νυχιών',
                description: 'Μανικιούρ και Πεντικιούρ'
            }),
            waxing: await ServiceCategory.create({
                name: 'Αποτρίχωση',
                description: 'Αποτρίχωση με κερί'
            }),
            massage: await ServiceCategory.create({
                name: 'Μασάζ',
                description: 'Μασάζ χαλάρωσης'
            })
        };


        // Υπηρεσιες ανά κατηγορία
        const services = {
            simpleManicure: await Service.create({
                name: 'Μανικιούρ - Απλό',
                price: 18,
                categoryId: categories.nails.id,
                durationMinutes: 30
            }),
            frenchManicure: await Service.create({
                name: 'Μανικιούρ - Γαλλικό',
                price: 20,
                categoryId: categories.nails.id,
                durationMinutes: 30
            }),
            semiManicure: await Service.create({
                name: 'Μανικιούρ - Ημιμόνιμο',
                price: 25,
                categoryId: categories.nails.id,
                durationMinutes: 45
            }),
            simplePedicure: await Service.create({
                name: 'Πεντικιούρ - Απλό',
                price: 22,
                categoryId: categories.nails.id,
                durationMinutes: 40
            }),
            frenchPedicure: await Service.create({
                name: 'Πεντικιούρ - Γαλλικό',
                price: 25,
                categoryId: categories.nails.id,
                durationMinutes: 45
            }),
            semiPedicure: await Service.create({
                name: 'Πεντικιούρ - Ημιμόνιμο',
                price: 30,
                categoryId: categories.nails.id,
                durationMinutes: 50
            }),

            bikiniWax: await Service.create({
                name: 'Αποτρίχωση - Μπικίνι',
                price: 40,
                categoryId: categories.waxing.id,
                durationMinutes: 20
            }),
            armsWax: await Service.create({
                name: 'Αποτρίχωση - Χέρια',
                price: 20,
                categoryId: categories.waxing.id,
                durationMinutes: 15
            }),


            fullBodyMassage: await Service.create({
                name: 'Μασάζ - Full Body 60\'',
                price: 28,
                categoryId: categories.massage.id,
                durationMinutes: 60
            }),
            backMassage: await Service.create({
                name: 'Μασάζ - Πλάτη 30\'',
                price: 15,
                categoryId: categories.massage.id,
                durationMinutes: 30
            })
        };

        const createEmployeeWithUser = async (name, email, phone, specialization) => {
            const user = await User.create({
                name,
                email,
                phone,
                password: hashedPassword,
                role: 'EMPLOYEE'
            });
            return await Employee.create({
                name,
                specialization,
                userId: user.id
            });
        };


        // Φτιάνω τα login των ασθητικών να κατηγορία
        const employees = {
            nail1: await createEmployeeWithUser(
                'Αισθητικός 1',
                'emp1@salon.com',
                '6933333331',
                'NAIL'
            ),
            nail2: await createEmployeeWithUser(
                'Αισθητικός 2',
                'emp2@salon.com',
                '6933333332',
                'NAIL'
            ),
            wax1: await createEmployeeWithUser(
                'Αισθητικός 3',
                'emp3@salon.com',
                '6933333333',
                'WAXING'
            ),
            wax2: await createEmployeeWithUser(
                'Αισθητικός 4',
                'emp4@salon.com',
                '6933333333',
                'WAXING'
            ),
            massage1: await createEmployeeWithUser(
                'Αισθητικός 5',
                'emp5@salon.com',
                '6933333333',
                'MASSAGE'
            ),
            massage2: await createEmployeeWithUser(
                'Αισθητικός 6',
                'emp6@salon.com',
                '6933333333',
                'MASSAGE'
            ),
        };

        const nailStaff = [employees.nail1, employees.nail2];
        const waxStaff = [employees.wax1, employees.wax2];
        const massageStaff = [employees.massage1, employees.massage2];

        for (const key of ['simpleManicure', 'frenchManicure', 'semiManicure', 'simplePedicure', 'frenchPedicure', 'semiPedicure']){
            await services[key].addEmployees(nailStaff);
        }

        for(const key of ['bikiniWax', 'armsWax']){
            await services[key].addEmployees(waxStaff);
        }

        for (const key of ['fullBodyMassage', 'BackMassage']){
            await services[key].addEmployees(massageStaff);
        }



        // test ραντεβού
        const today = new Date().toISOString().split('T')[0];

        await Appointment.bulkCreate([
            {
                date: today,
                time: '10:00',
                status: 'COMPLETED',
                customerName: User1.name,
                customerEmail: User1.email,
                phone: User1.phone,
                price: services.simpleManicure.price,
                durationMinutes: services.simpleManicure.durationMinutes,
                userId: User1.id,
                employeeId: employees.nail1.id,
                serviceId: services.simpleManicure.id
            },
            {
                date: today,
                time: '12:00',
                status: 'CONFIRMED',
                customerName: User2.name,
                customerEmail: User2.email,
                phone: User2.phone,
                price: services.fullBodyMassage.price,
                durationMinutes: services.fullBodyMassage.durationMinutes,
                userId: User2.id,
                employeeId: employees.massage1.id,
                serviceId: services.fullBodyMassage.id
            },
            {
                date: today,
                time: '15:00',
                status: 'PENDING',
                customerName: User3.name,
                customerEmail: User3.email,
                phone: User3.phone,
                price: services.bikiniWax.price,
                durationMinutes: services.bikiniWax.durationMinutes,
                userId: User3.id,
                employeeId: employees.wax1.id,
                serviceId: services.bikiniWax.id
            }
        ]);

        console.log('Database seeded successfully with users, services, employees, and  appointments!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

void seedDatabase();