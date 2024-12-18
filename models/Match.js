module.exports = (sequelize, DataTypes) => {
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
                model: 'Users',
                key: 'id',
            },
        },
        player2: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id',
            },
        },
        id_status: {
            type: DataTypes.BIGINT,
            references: {
                model: 'Statuses',
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

    Match.associate = function(models) {
        models.User.hasMany(Match, { foreignKey: 'player1' });
        models.User.hasMany(Match, { foreignKey: 'player2' });
        models.Status.hasMany(Match, { foreignKey: 'id_status' });
    };

    return Match;
};
