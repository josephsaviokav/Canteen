'use strict';

const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('items', [
      {
        id: uuidv4(),
        name: 'Cappuccino',
        price: 4.50,
        imageUrl: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400',
        available: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Espresso',
        price: 3.00,
        imageUrl: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400',
        available: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Latte',
        price: 4.00,
        imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400',
        available: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Croissant',
        price: 3.50,
        imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400',
        available: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Sandwich',
        price: 6.50,
        imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400',
        available: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Muffin',
        price: 3.00,
        imageUrl: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400',
        available: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Green Tea',
        price: 2.50,
        imageUrl: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400',
        available: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Salad Bowl',
        price: 7.00,
        imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
        available: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('items', null, {});
  }
};
