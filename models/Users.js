const { DataTypes } = require('sequelize');
const { sequelize } = require('../index');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [3, 20],
                msg: "Name must be between 3 and 20 characters",
            },
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [8, 255],
                msg: "Password must be between 8 and 255 characters",
            },
            is: {
                args: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                msg: "Password needs at least one lowercase letter, one uppercase letter, and one number",
            },
        },
    },
    mail: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            args: true,
            msg: "Email address is already in use",
        },
        validate: {
            isEmail: {
                args: true,
                msg: "Please enter a valid email address",
            },
        },
    },
    role_id: {
        type: DataTypes.INTEGER,
    },
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'users',
    hooks: {
        beforeCreate: async (user, options) => {
            const existingUser = await User.findOne({ where: { name: user.name } });
            if (existingUser) {
                throw new Error("Username is already in use");
            }
            const existingEmail = await User.findOne({ where: { mail: user.mail } });
            if (existingEmail) {
                throw new Error("Email address is already in use");
            }
        },
    },
});

const Role = sequelize.define('Role', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    name:  {
        type: DataTypes.STRING,
    },
});

User.belongsTo(Role, { foreignKey: 'role_id' });

module.exports = { User, Role };
