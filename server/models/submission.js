'use strict';
module.exports = (sequelize, DataTypes) => {
    const Submission = sequelize.define('Submission', {
        taskId: {
            type: DataTypes.INTEGER
        },
        submitterId: {
            type: DataTypes.INTEGER
        },
        pollId: {
            type: DataTypes.INTEGER
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
    return Submission;
};