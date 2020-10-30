// models iniciam as tabelas no sequelize, são usados no arquivo index da pasta database
const {Model, DataTypes} = require('sequelize');

class Notifications extends Model {
  static init(sequelize) {
    super.init({
    texto: DataTypes.STRING,
    refAssentos: DataTypes.JSON,
    status: DataTypes.INTEGER
    }, {
      sequelize,
      tableName: 'Notifications',
    });
  }

  static associate(models) {
    this.belongsTo(models.Sessions, { foreignKey: 'session_id', as: 'sessions' });
    this.belongsTo(models.Users, { foreignKey: 'user_id', as: 'users' });
  }
}

module.exports = Notifications;