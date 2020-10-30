// models iniciam as tabelas no sequelize, são usados no arquivo index da pasta database
const {Model, DataTypes} = require('sequelize');
const sequelizePaginate = require('sequelize-paginate')
class Rooms extends Model {
  static init(sequelize) {
    super.init({
      nome: DataTypes.STRING,
      assentos: {
        type: DataTypes.INTEGER,
        validate: {
              min: 20,
              max: 100
        }
      }
    }, {
      sequelize,
      tableName: 'Rooms',
    });
  }

  static associate(models) {
    this.hasMany(models.Sessions, { foreignKey: 'room_id', as: 'sessions' });
  }
}
sequelizePaginate.paginate(Rooms)
module.exports = Rooms;