'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('payments',{
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
      amount : {
        type : Sequelize.FLOAT,
        allowNull : false
      },
      paymentMethod : {
        type : Sequelize.ENUM('cash', 'card', 'upi'),
        allowNull : false
      },
      status : {
        type : Sequelize.ENUM('pending', 'completed', 'cancelled'),
        allowNull : false,
        defaultValue : 'pending'
      },
      transactionId : {
        type : Sequelize.STRING,
        allowNull : true
      },
      createdAt : {
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
    await queryInterface.dropTable('payments');
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
