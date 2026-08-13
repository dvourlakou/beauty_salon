const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    roles: {
        type: DataTypes.ENUM('CUSTOMER', 'ADMIN', 'EMPLOYEE'),
        defaultValue: 'CUSTOMER',
    },
}, {
    timestamps: true,
});

module.exports = User;

