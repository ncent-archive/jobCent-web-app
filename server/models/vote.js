'use strict';
module.exports = (sequelize, DataTypes) => {
    const Vote = sequelize.define('Vote', {
        pollId: {
            type: DataTypes.INTEGER
        },
        voterId: {
            type: DataTypes.INTEGER
        }
    }, {});
    Vote.associate = function(models) {
        Vote.belongsTo(models.Poll, {
            foreignKey: 'pollId',
            onDelete: 'CASCADE'
        });
        Vote.belongsTo(models.User, {
            foreignKey: 'voterId',
            onDelete: 'CASCADE'
        });
    };
    return Vote;
};