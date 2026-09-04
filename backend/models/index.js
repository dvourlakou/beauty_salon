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
db.Review = require('./Review')(sequelize);

//Σχέσεις μεταξύ των πινάκων

//ServiceCategory με Service
db.ServiceCategory.hasMany(db.Service, {foreignKey: 'categoryId', as: 'Services'});
db.Service.belongsTo(db.ServiceCategory, {foreignKey: 'categoryId'});

//User as Customer με Employee
db.User.hasOne(db.Employee, {foreignKey: 'userID'});
db.Employee.belongsTo(db.User, {foreignKey: 'userId'});

//Service με Employee
db.Service.belongsToMany(db.Employee, {
    through: 'ServiceEmployees',
    foreignKey: 'serviceId',
    otherKey: 'employeeId',
    as: 'Employees'
});

db.Employee.belongsToMany(db.Service, {
    through: 'ServiceEmployees',
    foreignKey: 'employeeId',
    otherKey: 'serviceId',
    as: 'Services'
});



//Employee με Appointment
db.Employee.hasMany(db.Appointment, {foreignKey: 'employeeId'});
db.Appointment.belongsTo(db.Employee, {foreignKey: 'employeeId'});

//User as Customer με Appointment
db.User.hasMany(db.Appointment, {foreignKey: 'userId'});
db.Appointment.belongsTo(db.User, {foreignKey: 'userId'});

//Service με Appointment
db.Service.hasMany(db.Appointment, {foreignKey: 'serviceId'});
db.Appointment.belongsTo(db.Service, {foreignKey: 'serviceId'});

//Appointment με  Review 1to1
db.Appointment.hasOne(db.Review, {foreignKey: 'appointmentId'});
db.Review.belongsTo(db.Appointment, {foreignKey: 'appointmentId'});

module.exports = db;
