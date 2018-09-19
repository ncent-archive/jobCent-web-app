'use strict';
module.exports = (sequelize, DataTypes) => {
    const Poll = sequelize.define('Poll', {
        votingDurationMins: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        numSelectionsPerVoter: {
            type: DataTypes.INTEGER,
            defaultValue: 1
        },
        description: {
            type: DataTypes.STRING
        },
        taskId: {
            type: DataTypes.INTEGER
        }
    }, {});
    Poll.associate = function(models) {
        Poll.hasMany(models.Vote, {
            foreignKey: 'pollId',
            as: 'votes'
        });
        Poll.belongsToMany(models.User, {
            as: 'Voters',
            through: 'Votes',
            foreignKey: 'pollId'
        });
        Poll.hasMany(models.Submission, {
            foreignKey: 'pollId',
            as: 'submissions'
        });
        Poll.belongsTo(models.Task, {
            foreignKey: 'taskId',
            onDelete: 'CASCADE'
        });
    };
    return Poll;
};