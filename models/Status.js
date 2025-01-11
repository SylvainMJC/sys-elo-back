const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Status = sequelize.define('Status', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
}, {
    timestamps: false,
    tableName: 'statuses',
});

Status.associate = function(models) {
    Status.hasMany(models.Match, { 
        foreignKey: 'id_status',
        as : 'matches' 
    });
};

module.exports = Status;