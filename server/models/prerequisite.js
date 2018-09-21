'use strict';
module.exports = (sequelize, DataTypes) => {
    const Prerequisite = sequelize.define('Prerequisite', {
        uuid: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4
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
    sequelize.sync();
    return Prerequisite;
};