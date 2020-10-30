// models iniciam as tabelas no sequelize, são usados no arquivo index da pasta database
const {Model, DataTypes} = require('sequelize');
const sequelizePaginate = require('sequelize-paginate')
class Seats extends Model {
  static init(sequelize) {
    super.init({
    qntAssentos: DataTypes.INTEGER,
    refAssentos: DataTypes.JSON,
    }, {
      sequelize,
      tableName: 'Seats',
    });
  }

  static associate(models) {
    this.belongsTo(models.Sessions, { foreignKey: 'session_id', as: 'sessions' });
    this.belongsTo(models.Users, { foreignKey: 'user_id', as: 'users' });
  }
}
sequelizePaginate.paginate(Seats)
module.exports = Seats;