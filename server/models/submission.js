'use strict';
module.exports = (sequelize, DataTypes) => {
    const Submission = sequelize.define('Submission', {
        uuid: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4
        }
    }, {});
    Submission.associate = function(models) {
        Submission.belongsTo(models.Task, {
            foreignKey: 'taskId',
            onDelete: 'CASCADE'
        });
        Submission.belongsTo(models.User, {
            foreignKey: 'submitterId',
            onDelete: 'CASCADE'
        });
        Submission.belongsTo(models.Poll, {
            foreignKey: 'pollId',
            onDelete: 'CASCADE'
        });
    };
    sequelize.sync();
    return Submission;
};