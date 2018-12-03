'use strict';
module.exports = {
    up: (queryInterface, DataTypes) => {
        return queryInterface.createTable('CodeRedemptions', {
            uuid: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.UUID
            },
            referralCode: {
                allowNull: false,
                type: DataTypes.STRING
            },
            userUuid: {
                allowNull: false,
                type: DataTypes.UUID,
                foreignKey: true,
                onDelete: 'CASCADE',
                references: {
                    model: 'Users',
                    key: 'uuid',
                    as: 'userUuid'
                }
            },
            createdAt: {
                allowNull: false,
                type: DataTypes.DATE
            },
            updatedAt: {
                allowNull: false,
                type: DataTypes.DATE
            }
        });
    },
    down: (queryInterface, DataTypes) => {
        return queryInterface.dropTable('CodeRedemptions');
    }
};