const {DataTypes} = require('sequelize');
const {sequelize} = require('/index');

const ServiceCategory = sequelize.define( 'ServiceCategory' , {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    timestamps: true,
});

module.exports = ServiceCategory;