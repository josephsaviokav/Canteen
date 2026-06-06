'use strict';

const { v4: uuidv4 } = require('uuid');

const categories = [
  { id: uuidv4(), name: 'Breakfast' },
  { id: uuidv4(), name: 'Lunch' },
  { id: uuidv4(), name: 'Snacks' },
  { id: uuidv4(), name: 'Dinner' },
  { id: uuidv4(), name: 'Drinks' },
  { id: uuidv4(), name: 'Beverages' },
  { id: uuidv4(), name: 'Desserts' },
  { id: uuidv4(), name: 'Breakfast, Lunch' },
  { id: uuidv4(), name: 'Breakfast, Dinner' },
  { id: uuidv4(), name: 'Lunch, Dinner' },
  { id: uuidv4(), name: 'Breakfast, Lunch, Dinner' },
];

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('categories', categories.map(cat => ({
      category_id: cat.id,
      category_name: cat.name,
      category_description: `${cat.name} category`,
      created_at: new Date(),
      updated_at: new Date(),
    })));
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('categories', {
      category_name: categories.map(c => c.name)
    });
  }
};