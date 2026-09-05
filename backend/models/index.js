const {Sequelize} = require('sequelize');
const dotenv = require('dotenv');

dotenv.config({path:'./.env'});


const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        port : process.env.DB_PORT || 3307,
        logging: false
    }
);

const db = {sequelize};

//import modules
db.User = require('./User')(sequelize);
db.ServiceCategory = require('./ServiceCategory')(sequelize);
db.Service = require('./Service')(sequelize);
db.Employee = require('./Employee')(sequelize);
db.Appointment = require('./Appointment')(sequelize);


//Σχέσεις μεταξύ των πινάκων

//ServiceCategory με Service
db.ServiceCategory.hasMany(db.Service, {foreignKey: 'categoryId', as: 'services'});
db.Service.belongsTo(db.ServiceCategory, {foreignKey: 'categoryId', as: 'category' });

//User με Employee
db.User.hasOne(db.Employee, {foreignKey: 'userId',as: 'employeeProfile', onDelete: 'CASCADE'});
db.Employee.belongsTo(db.User, {foreignKey: 'userId', as: 'user'});

//Service με Employee
db.Service.belongsToMany(db.Employee, {
    through: 'EmployeeServices',
    foreignKey: 'serviceId',
    otherKey: 'employeeId',
    as: 'employees'
});

db.Employee.belongsToMany(db.Service, {
    through: 'EmployeeServices',
    foreignKey: 'employeeId',
    otherKey: 'serviceId',
    as: 'services'
});



//Employee με Appointment
db.Employee.hasMany(db.Appointment, {foreignKey: 'employeeId', as: 'appointments'});
db.Appointment.belongsTo(db.Employee, {foreignKey: 'employeeId', as: 'employee'});

//User  με Appointment
db.User.hasMany(db.Appointment, {foreignKey: 'userId', as: 'appointments'});
db.Appointment.belongsTo(db.User, {foreignKey: 'userId', as: 'customer'});

//Service με Appointment
db.Service.hasMany(db.Appointment, {foreignKey: 'serviceId', as: 'appointments'});
db.Appointment.belongsTo(db.Service, {foreignKey: 'serviceId', as: 'service'});



module.exports = db;
