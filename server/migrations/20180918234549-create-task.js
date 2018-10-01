'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Tasks', {
            uuid: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID
            },
            taskName: {
                type: Sequelize.STRING,
                allowNull: false
            },
            requirements: {
                type: Sequelize.STRING
            },
            redemptionAmount: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            winnerId: {
                type: Sequelize.UUID,
                foreignKey: true,
                onDelete: 'CASCADE',
                references: {
                    model: 'Users',
                    key: 'uuid',
                    as: 'winnerId'
                }
            },
            challengeId: {
                type: Sequelize.UUID,
                foreignKey: true,
                allowNull: false,
                onDelete: 'CASCADE',
                references: {
                    model: 'Challenges',
                    key: 'uuid',
                    as: 'challengeId'
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
        return queryInterface.dropTable('Tasks');
    }
};