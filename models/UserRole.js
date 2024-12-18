module.exports = (sequelize, DataTypes) => {
    const UserRole = sequelize.define('UserRole', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },
        id_user: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id',
            },
        },
        id_role: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: 'Roles',
                key: 'id',
            },
        },
    }, {
        timestamps: false,
        tableName: 'users_roles',
    });

    UserRole.associate = function(models) {
        models.User.belongsToMany(models.Role, { through: UserRole, foreignKey: 'id_user' });
        models.Role.belongsToMany(models.User, { through: UserRole, foreignKey: 'id_role' });
    };

    return UserRole;
};
