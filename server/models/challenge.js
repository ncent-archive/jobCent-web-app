'use strict';
module.exports = (sequelize, DataTypes) => {
    const Challenge = sequelize.define('Challenge', {
        challengeTitle: {
            type: DataTypes.STRING,
            allowNull: false
        },
        totalRewardAmount: {
            type: DataTypes.INTEGER
        },
        totalRewardUnits: {
            type: DataTypes.STRING
        },
        challengeDescription: {
            type: DataTypes.STRING
        },
        sponsorId: {
            type: DataTypes.INTEGER
        }
    }, {});

    Challenge.associate = function(models) {
        Challenge.hasMany(models.Task, {
            foreignKey: 'challengeId',
            as: 'tasks'
        });
        Challenge.belongsTo(models.User, {
            foreignKey: 'sponsorId',
            onDelete: 'CASCADE'
        });
    };
    return Challenge;
};