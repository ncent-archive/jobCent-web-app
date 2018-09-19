'use strict';
module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    challengeId: DataTypes.INTEGER,
    taskName: DataTypes.STRING,
    requirements: DataTypes.STRING,
    submissionPeriodMins: DataTypes.INTEGER,
    percentOfTotalRewards: DataTypes.INTEGER,
    numFinalists: DataTypes.INTEGER
  }, {});
  Task.associate = function(models) {
    // associations can be defined here
  };
  return Task;
};