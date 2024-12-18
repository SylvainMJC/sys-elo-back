// module.exports = (sequelize, DataTypes) => {
//     const User = sequelize.define('User', {
//         id: {
//             type: DataTypes.INTEGER,
//             primaryKey: true,
//             autoIncrement: true,
//         },
//         name: {
//             type: DataTypes.STRING,
//             allowNull: false,
//             validate: {
//                 len: {
//                     args: [3, 20],
//                     msg: "Name must be between 3 and 20 characters",
//                 },
//             },
//         },
//         password: {
//             type: DataTypes.STRING,
//             allowNull: false,
//             validate: {
//                 len: {
//                     args: [8, 255],
//                     msg: "Password must be between 8 and 255 characters",
//                 },
//                 is: {
//                     args: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
//                     msg: "Password needs at least one lowercase letter, one uppercase letter, and one number",
//                 },
//             },
//         },
//         email: {
//             type: DataTypes.STRING,
//             allowNull: false,
//             unique: {
//                 args: true,
//                 msg: "Email address is already in use",
//             },
//             validate: {
//                 isEmail: {
//                     args: true,
//                     msg: "Please enter a valid email address",
//                 },
//                 validate: {
//                     isEmail: {
//                         args: true,
//                         msg: "Please enter a valid email address",
//                     },
//                 },
//             },
            
//         },
//         role_id: {
//             type: DataTypes.INTEGER,
//             references: {
//                 model: 'Roles',
//                 key: 'id',
//             },
//         },
//         elo: {
//             type: DataTypes.INTEGER,
//             allowNull: false,
//             defaultValue: 1000,
//         },
//     }, {
//         timestamps: true,
//         createdAt: 'created_at',
//         updatedAt: 'updated_at',
//         tableName: 'users',
//     });

//     User.associate = function(models) {
//         User.belongsTo(models.Role, { foreignKey: 'role_id' });
//     };

//     return User;
// };

module.exports = (sequelize, DataTypes) => {
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
        email: {
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
            references: {
                model: 'Roles',
                key: 'id',
            },
        },
        elo: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1000,
        },
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        tableName: 'users',
    });

    User.associate = function(models) {
        User.belongsTo(models.Role, { foreignKey: 'role_id' });
    };

    return User;
};
