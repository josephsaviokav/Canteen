'use strict';

const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('items', [
      {
        id: uuidv4(),
        name: 'Chicken Biryani',
        price: 70,
        imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400',
        available: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Veg Biryani',
        price: 40,
        imageUrl: 'https://images.unsplash.com/photo-1642821373181-696a54913e93?w=400',
        available: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Rice',
        price: 30,
        imageUrl: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=400',
        available: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Chapati',
        price: 10,
        imageUrl: 'https://images.unsplash.com/photo-1708782343717-be4ea260249a?w=400',
        available: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Poori',
        price: 10,
        imageUrl: 'https://images.unsplash.com/photo-1643892467625-65df6a500524?w=400',
        available: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Masala Dosa',
        price: 60,
        imageUrl: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400',
        available: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Plain Dosa',
        price: 30,
        imageUrl: 'https://images.unsplash.com/photo-1694849789325-914b71ab4075?w=400',
        available: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Idli',
        price: 7,
        imageUrl: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400',
        available: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Vada',
        price: 10,
        imageUrl: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400',
        available: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Samosa',
        price: 10,
        imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400',
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
