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