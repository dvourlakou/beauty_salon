const {DataTypes} = require('sequelize');

module.exports =  (sequelize) => {
    return sequelize.define('Employee', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        specialization: {
            type: DataTypes.ENUM('NAIL', 'WAXING', 'MASSAGE'),
            allowNull: false,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    }, {
        timestamps: true,
    });
};
