'use strict';
module.exports = (sequelize, DataTypes) => {
  const Submission = sequelize.define('Submission', {
    taskId: DataTypes.INTEGER,
    submitterId: DataTypes.INTEGER,
    timestamp: DataTypes.TIME
  }, {});
  Submission.associate = function(models) {
    // associations can be defined here
  };
  return Submission;
};