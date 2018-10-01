'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Challenges', {
            uuid: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID
            },
            challengeTitle: {
                type: Sequelize.STRING,
                allowNull: false
            },
            challengeDescription: {
                type: Sequelize.STRING
            },
            tokenTypeUuid: {
                type: Sequelize.UUID,
                allowNull: false
            },
            sponsorId: {
                type: Sequelize.UUID,
                foreignKey: true,
                allowNull: false,
                onDelete: 'CASCADE',
                references: {
                    model: 'Users',
                    key: 'uuid',
                    as: 'sponsorId'
                }
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('Challenges');
    }
};