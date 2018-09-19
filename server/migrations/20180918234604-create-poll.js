'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Polls', {
            uuid: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID
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