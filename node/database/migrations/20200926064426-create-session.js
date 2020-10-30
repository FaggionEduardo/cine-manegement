// Migrations são arquivos que configuram as tabelas MySQL e seus itens.
module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable('Sessions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      data: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      horario: {
        allowNull: false,
        type: DataTypes.TIME,
      },
      horarioFinal: {
        allowNull: false,
        type: DataTypes.TIME,
      },
      animacao: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      audio: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      faturamento: {
        allowNull: false,
        type: DataTypes.FLOAT,
      },
      status: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      movie_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {model: 'Movies', key: 'id'},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      room_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {model: 'Rooms', key: 'id'},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    });
  },

  down: (queryInterface) => {
    return queryInterface.dropTable('Session');
  }
};
