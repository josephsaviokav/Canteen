'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('items',{
      id : {
        type : Sequelize.UUID,
        defaultValue : Sequelize.UUIDV4,
        primaryKey : true,
        allowNull : false
      },
      name : {
        type : Sequelize.STRING,
        allowNull : false
      },
      price : {
        type : Sequelize.FLOAT,
        allowNull : false
    }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('items');
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
