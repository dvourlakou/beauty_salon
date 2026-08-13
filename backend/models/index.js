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
        port : 3307,
        logging: false
    }
);

const db = {sequelize};

//import modules
db.User = require('./User')(sequelize);
db.ServiceCategory = require('./ServiceCategory')(sequelize);
db.Service = require('./Service')(sequelize);

//relationships
db.ServiceCategory.hasMany(db.Service, {foreignKey: 'categoryId'});
db.Service.belongsTo(db.ServiceCategory, {foreignKey: 'categoryId'});

module.exports = db;
