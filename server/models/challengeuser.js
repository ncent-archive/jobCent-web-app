'use strict';

module.exports = (sequelize, DataTypes) => {
  const ChallengeUser = sequelize.define('ChallengeUser', {
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4
    },
    challengeUuid: {
      allowNull: false,
      type: DataTypes.UUID
    },
    referralCode: {
      allowNull: false,
      type: DataTypes.STRING(525)
    },
    tokensPerReferral: {
      allowNull: false,
      defaultValue: 1,
      type: DataTypes.INTEGER
    },

  }, {});
  ChallengeUser.associate = function (models) {
    ChallengeUser.belongsTo(models.User, {
      foreignKey: 'userUuid',
      onDelete: 'CASCADE'
    });
  };
  return ChallengeUser;
};
