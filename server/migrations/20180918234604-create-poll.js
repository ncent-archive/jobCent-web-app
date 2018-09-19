'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Polls', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            votingDurationMins: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            numSelectionsPerVoter: {
                type: Sequelize.INTEGER
            },
            description: {
                type: Sequelize.STRING
            },
            taskId: {
                type: Sequelize.INTEGER,
                onDelete: 'CASCADE',
                references: {
                    model: 'Tasks',
                    key: 'id',
                    as: 'taskId'
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
        return queryInterface.dropTable('Polls');
    }
};