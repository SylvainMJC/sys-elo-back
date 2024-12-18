module.exports = (sequelize, DataTypes) => {
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

    return Status;
};
