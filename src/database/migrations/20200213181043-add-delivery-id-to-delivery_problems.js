module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('delivery_problems', 'delivery_id', {
      type: Sequelize.INTEGER,
      references: { model: 'orders', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: false,
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('delivery_problems', 'delivery_id');
  },
};
