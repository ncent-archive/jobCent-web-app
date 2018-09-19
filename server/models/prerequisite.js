'use strict';
module.exports = (sequelize, DataTypes) => {
    const Prerequisite = sequelize.define('Prerequisite', {
        prerequisiteTaskId: {
            type: DataTypes.INTEGER
        },
        dependentTaskId: {
            type: DataTypes.INTEGER
        }
    }, {});
    Prerequisite.associate = function(models) {
        Prerequisite.belongsTo(models.Task, {
            foreignKey: 'prerequisiteTaskId',
            onDelete: 'CASCADE'
        });
        Prerequisite.belongsTo(models.Task, {
            foreignKey: 'dependentTaskId',
            onDelete: 'CASCADE'
        });

    };
    return Prerequisite;
};