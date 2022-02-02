'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        foreignKey: 'userId'
      });
      this.addScope('userProfile', {
        include: [
          {
              model: models.User,
              attributes: ['uuid'],
              include: [
                  {
                      model: models.UserProfile,
                      attributes: ['email', 'name']
                  }
              ]
          }
        ]
      });
    }
  }
  Message.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    socketId: {
      type: DataTypes.STRING,
    },
    userId: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Message',
  });
  return Message;
};