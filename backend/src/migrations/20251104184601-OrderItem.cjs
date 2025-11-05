'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('orderItem',{
      id : {
        type : Sequelize.UUID,
        defaultValue : Sequelize.UUIDV4,
        primaryKey : true,
        allowNull : false
      },
      orderId : {
        type : Sequelize.UUID,
        allowNull : false,
        references : {
          model : 'orders',
          key : 'id'
        },
        onDelete : 'CASCADE'
      },
      itemId : {
        type : Sequelize.UUID,
        allowNull : false,
        references : {
          model : 'items',
          key : 'id'
        },
        onDelete : 'CASCADE'
      },
      quantity : {
        type : Sequelize.INTEGER,
        allowNull : false,
        defaultValue : 1
      },
      price : {
        type : Sequelize.FLOAT,
        allowNull : false
      },
      subtotal : {
        type : Sequelize.FLOAT,
        allowNull : false
      }
    });
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('orderItem');
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
