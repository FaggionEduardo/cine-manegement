// Migrations são arquivos que configuram as tabelas MySQL e seus itens.
module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable('Notifications', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      texto: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      status: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      refAssentos :{
        allowNull: true,
        type: DataTypes.JSON,
      },
      user_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {model: 'Users', key: 'id'},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      session_id: {
        allowNull: true,
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
    return queryInterface.dropTable('Notifications');
  },
};

