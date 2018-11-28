'use strict';
module.exports = {
    up: (queryInterface, DataTypes) => {
        return queryInterface.createTable('ChallengeUsers', {
            uuid: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.UUID
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
            challengeUuid: {
                allowNull: false,
                type: DataTypes.UUID
            },
            referralCode: {
                allowNull: false,
                type: DataTypes.STRING
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
        return queryInterface.dropTable('ChallengeUsers');
    }
};