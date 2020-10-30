// Migrations são arquivos que configuram as tabelas MySQL e seus itens.
module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable('Seats', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      user_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {model: 'Users', key: 'id'},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      qntAssentos: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      refAssentos :{
        allowNull: false,
        type: DataTypes.JSON,
      },
      session_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {model: 'Sessions', key: 'id'},
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
    return queryInterface.dropTable('Seats');
  },
};
