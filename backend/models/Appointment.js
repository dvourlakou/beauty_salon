const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Appointment', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id',
            },
        },
        employeeId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'Employees',
                key: 'id',
            },
        },
        serviceId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Services',
                key: 'id',
            },
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        time: {
            type: DataTypes.TIME,
            allowNull: false,
        },
        durationMinutes: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false, // Υποχρεωτικό πεδίο
        },
        status: {
            type: DataTypes.ENUM('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'),
            defaultValue: 'PENDING',
        },
        notes: {
            type: DataTypes.TEXT,
        },
    }, {
        timestamps: true,
    });
};