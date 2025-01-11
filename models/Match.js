const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Match = sequelize.define('Match', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    player1: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
            model: 'Users',
            key: 'id',
        },
    },
    player2: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
            model: 'Users', 
            key: 'id',
        },
    },
    id_status: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 'pending',
        references: {
            model: 'Statuses', 
            key: 'id',
        },
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    result_player1: {
        type: DataTypes.BIGINT,
        allowNull: true,
    },
    result_player2: {
        type: DataTypes.BIGINT,
        allowNull: true,
    },
}, {
    timestamps: false, 
    tableName: 'matches', 
});


Match.associate = function(models) {
    Match.belongsTo(models.User, { as: 'Player1', foreignKey: 'player1' });
    Match.belongsTo(models.User, { as: 'Player2', foreignKey: 'player2' });
    Match.belongsTo(models.Status, { foreignKey: 'id_status' });
};

module.exports = Match;
