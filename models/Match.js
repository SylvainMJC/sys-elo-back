const { DataTypes } = require('sequelize');
const { sequelize } = require('../index');
const { User } = require('./User');
const { Status } = require('./status');

const Match = sequelize.define('Match', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    player1: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
    player2: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
    id_status: {
        type: DataTypes.BIGINT,
        references: {
            model: Status,
            key: 'id',
        },
    },
    created_at: {
        type: DataTypes.DATE,
    },
    updated_at: {
        type: DataTypes.DATE,
    },
    result_player1: {
        type: DataTypes.BIGINT,
    },
    result_player2: {
        type: DataTypes.BIGINT,
    },
}, {
    timestamps: false,
    tableName: 'matches',
});

User.hasMany(Match, { foreignKey: 'player1' });
User.hasMany(Match, { foreignKey: 'player2' });
Status.hasMany(Match, { foreignKey: 'id_status' });

module.exports = { Match };
