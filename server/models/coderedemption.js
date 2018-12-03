'use strict';
module.exports = (sequelize, DataTypes) => {
    const CodeRedemption = sequelize.define('CodeRedemption', {
        uuid: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4
        },
        referralCode: {
            allowNull: false,
            type: DataTypes.STRING
        }
    }, {});
    CodeRedemption.associate = function (models) {
        CodeRedemption.belongsTo(models.User, {
            foreignKey: 'userUuid',
            onDelete: 'CASCADE'
        });
    };
    return CodeRedemption;
};