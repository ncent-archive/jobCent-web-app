'use strict';
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        uuid: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4
        },
        name: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        publicKey: {
            type: DataTypes.STRING
        },
        privateKey: {
            type: DataTypes.STRING
        },
        otpKey: {
            type: DataTypes.STRING
        },
        otpExp: {
            type: DataTypes.BIGINT
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
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
    };
    sequelize.sync();
    return User;
};