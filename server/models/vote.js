'use strict';
module.exports = (sequelize, DataTypes) => {
    const Vote = sequelize.define('Vote', {
        uuid: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4
        },
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