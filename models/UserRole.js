const { DataTypes } = require('sequelize');
const { sequelize } = require('../index');
const { User } = require('./User');
const { Role } = require('./Role');

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
            model: User,
            key: 'id',
        },
    },
    id_role: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: Role,
            key: 'id',
        },
    },
}, {
    timestamps: false,
    tableName: 'users_roles',
});

User.belongsToMany(Role, { through: UserRole, foreignKey: 'id_user' });
Role.belongsToMany(User, { through: UserRole, foreignKey: 'id_role' });

module.exports = { UserRole };
