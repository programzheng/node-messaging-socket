'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasOne(models.UserProfile, {
        foreignKey: 'userId'
      });
    }
  }
  User.init({
    uuid: DataTypes.STRING,
    account: DataTypes.STRING,
    password: DataTypes.STRING,
  }, {
    scopes: {
      withoutAccount: {
        attributes: { exclude:  ['account'] },
      },
      withoutPassword: {
        attributes: { exclude: ['password'] },
      }
    },
    sequelize,
    paranoid: true,
    modelName: 'User',
  });
  return User;
};