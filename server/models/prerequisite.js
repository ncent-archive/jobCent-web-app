'use strict';
module.exports = (sequelize, DataTypes) => {
  const Prerequisite = sequelize.define('Prerequisite', {
    prerequisiteTaskId: DataTypes.INTEGER,
    dependentTaskId: DataTypes.INTEGER
  }, {});
  Prerequisite.associate = function(models) {
    // associations can be defined here
  };
  return Prerequisite;
};