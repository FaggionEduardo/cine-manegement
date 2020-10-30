// models iniciam as tabelas no sequelize, são usados no arquivo index da pasta database
const {Model, DataTypes} = require('sequelize');
const sequelizePaginate = require('sequelize-paginate')
class Sessions extends Model {
  static init(sequelize) {
    super.init({
    data: DataTypes.DATE,
    horario: DataTypes.TIME,
    horarioFinal: DataTypes.TIME,
    animacao:DataTypes.INTEGER,
    audio:DataTypes.INTEGER,
    faturamento: DataTypes.STRING,
    status:DataTypes.INTEGER,
    }, {
      sequelize,
      tableName: 'Sessions',
    });
  }

  static associate(models) {
    this.belongsTo(models.Movies, { foreignKey: 'movie_id', as: 'movies' });
    this.belongsTo(models.Rooms, { foreignKey: 'room_id', as: 'rooms' });
    this.hasMany(models.Seats, { foreignKey: 'session_id', as: 'seats' });
    this.hasMany(models.Notifications, { foreignKey: 'session_id', as: 'notifications' });
  }
}
sequelizePaginate.paginate(Sessions)
module.exports = Sessions;