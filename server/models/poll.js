'use strict';
module.exports = (sequelize, DataTypes) => {
  const Poll = sequelize.define('Poll', {
    votingDurationMins: DataTypes.INTEGER,
    numSelectionsPerVoter: DataTypes.INTEGER,
    description: DataTypes.STRING
  }, {});
  Poll.associate = function(models) {
    // associations can be defined here
  };
  return Poll;
};