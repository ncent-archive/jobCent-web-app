'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Tasks', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            challengeId: {
                type: Sequelize.INTEGER,
                onDelete: 'CASCADE',
                references: {
                    model: 'Challenges',
                    key: 'id',
                    as: 'challengeId',
                },
            },
            taskName: {
                type: Sequelize.STRING,
                allowNull: false
            },
            requirements: {
                type: Sequelize.STRING
            },
            submissionPeriodMins: {
                type: Sequelize.INTEGER
            },
            percentOfTotalRewards: {
                type: Sequelize.INTEGER
            },
            numFinalists: {
                type: Sequelize.INTEGER
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