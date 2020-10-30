// Migrations são arquivos que configuram as tabelas MySQL e seus itens.
module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable('Rooms', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      nome: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true
      },
      assentos: {
        allowNull: false,
        type: DataTypes.INTEGER,
        validate: {
              min: 20,
              max: 100
        }
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
    return queryInterface.dropTable('Rooms');
  }
};
