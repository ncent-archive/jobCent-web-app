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
        submissionPeriodMins: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        percentOfTotalRewards: {
            type: DataTypes.INTEGER
        },
        numFinalists: {
            type: DataTypes.INTEGER,
            defaultValue: 1
        }
    }, {});
    Task.associate = function(models) {
        Task.belongsTo(models.Challenge, {
            foreignKey: 'challengeId',
            onDelete: 'CASCADE'
        });
        Task.hasOne(models.Poll, {
            foreignKey: 'taskId',
            as: 'poll'
        });
        Task.hasMany(models.Submission, {
            foreignKey: 'taskId',
            as: 'submissions'
        });
        Task.belongsToMany(models.User, {
            as: 'Contributors',
            through: 'Submissions',
            foreignKey: 'taskId'
        });
        Task.belongsToMany(models.Task, {
            as: 'PrerequisiteTasks',
            through: 'Prerequisites',
            foreignKey: 'dependentTaskId'
        });
        Task.belongsToMany(models.Task, {
            as: 'DependentTasks',
            through: 'Prerequisites',
            foreignKey: 'prerequisiteTaskId'
        });
    };
    sequelize.sync();
    return Task;
};