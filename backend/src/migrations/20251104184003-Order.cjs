'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('orders',{
      id : {
        type : Sequelize.UUID,
        defaultValue : Sequelize.UUIDV4,
        primaryKey : true,
        allowNull : false
      },
      userId : {
        type : Sequelize.UUID,
        allowNull : false,
        references : {
          model : 'users',
          key : 'id'
        },
        onDelete : 'CASCADE'
      },
      amount : {
        type : Sequelize.FLOAT,
        allowNull : false
      },
      status : {
        type : Sequelize.ENUM('pending', 'completed', 'cancelled'),
        allowNull : false,
        defaultValue : 'pending'
      },
      createdAt : {
        type : Sequelize.DATE,
        allowNull : false,
        defaultValue : Sequelize.NOW
      },
      updatedAt : {
        type : Sequelize.DATE,
        allowNull : false,
        defaultValue : Sequelize.NOW
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
    await queryInterface.dropTable('orders');
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};

// 20251104184601-Order.cjs

// 20251104184003-Payment.cjs

// 20251104184659-OrderItem.cjs
