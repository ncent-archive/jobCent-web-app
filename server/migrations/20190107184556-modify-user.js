'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("Users", "hash");
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("Users", "hash", Sequelize.STRING);
  }
};
