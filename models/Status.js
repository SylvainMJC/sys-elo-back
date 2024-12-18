const { DataTypes } = require('sequelize');
const { sequelize } = require('../index');

const Status = sequelize.define('Status', {
    id: {
        type: DataTypes.BIGINT,
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

module.exports = { Status };
