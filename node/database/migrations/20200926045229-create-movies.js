// Migrations são arquivos que configuram as tabelas MySQL e seus itens.
module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable('Movies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      imagem: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true
      },
      titulo: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true
      },
      descricao: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      duracao: {
        allowNull: false,
        type: DataTypes.TIME,
      },
      faturamento: {
        allowNull: false,
        type: DataTypes.FLOAT,
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
    return queryInterface.dropTable('Movies');
  }
};
