'use strict';
module.exports = (sequelize, DataTypes) => {
  const Vote = sequelize.define('Vote', {
    pollId: DataTypes.INTEGER,
    voterId: DataTypes.INTEGER,
    timestamp: DataTypes.TIME
  }, {});
  Vote.associate = function(models) {
    // associations can be defined here
  };
  return Vote;
};