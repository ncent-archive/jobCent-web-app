'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Challenges', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      challengeTitle: {
        type: Sequelize.STRING
      },
      totalRewardAmount: {
        type: Sequelize.INTEGER
      },
      totalRewardUnits: {
        type: Sequelize.STRING
      },
      challengeDescription: {
        type: Sequelize.STRING
      },
      sponsorId: {
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
    return queryInterface.dropTable('Challenges');
  }
};