'use strict';
module.exports = (sequelize, DataTypes) => {
    const Task = sequelize.define('Task', {
        uuid: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4
        },
        taskName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        requirements: {
            type: DataTypes.STRING
        },
        redemptionAmount: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {});
    Task.associate = function(models) {
        Task.belongsTo(models.Challenge, {
            foreignKey: 'challengeId',
            onDelete: 'CASCADE'
        });
        Task.belongsTo(models.User, {
            foreignKey: 'winnerId',
            onDelete: 'CASCADE'
        });
    };
    sequelize.sync();
    return Task;
};