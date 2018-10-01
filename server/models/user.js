'use strict';
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        uuid: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4
        },
        emailAddress: {
            type: DataTypes.STRING,
            allowNull: false
        },
        walletAddressPublicKey: {
            type: DataTypes.STRING,
            allowNull: false
        },
        walletAddressPrivateKey: {
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
    };
    sequelize.sync();
    return User;
};