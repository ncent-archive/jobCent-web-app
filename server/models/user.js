'use strict';
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        uuid: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4
        },
        userName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        emailAddress: {
            type: DataTypes.STRING,
            allowNull: false
        },
        company: {
            type: DataTypes.STRING
        }
    }, {});

    User.associate = function(models) {
        User.hasMany(models.Challenge, {
            foreignKey: 'sponsorId',
            as: 'sponsoredChallenges'
        });
        User.hasMany(models.Submission, {
            foreignKey: 'submitterId',
            as: 'submissions'
        });
        User.belongsToMany(models.Task, {
            as: 'Submitter',
            through: 'Submissions',
            foreignKey: 'submitterId'
        });
        User.hasMany(models.Vote, {
            foreignKey: 'voterId',
            as: 'votes'
        });
        User.belongsToMany(models.Poll, {
            as: 'PollsVotedOn',
            through: 'Votes',
            foreignKey: 'voterId'
        });
    };
    return User;
};