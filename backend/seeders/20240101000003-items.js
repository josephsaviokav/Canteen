'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    // get category IDs from DB
    const cats = await queryInterface.sequelize.query(
      `SELECT category_id, category_name FROM categories`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const catMap = {};
    cats.forEach(c => { catMap[c.category_name] = c.category_id; });

    await queryInterface.bulkInsert('items', [
      // Lunch & Dinner
      {
        item_id: uuidv4(),
        category_id: catMap['Lunch, Dinner'],
        item_name: 'Veg Rice',
        item_description: 'Steamed rice with mixed vegetable curry',
        price: 60.00,
        image_url: 'https://placehold.co/400x300?text=Veg+Rice',
        stock_quantity: 50,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        item_id: uuidv4(),
        category_id: catMap['Lunch, Dinner'],
        item_name: 'Chicken Curry Rice',
        item_description: 'Steamed rice with spicy chicken curry',
        price: 90.00,
        image_url: 'https://placehold.co/400x300?text=Chicken+Rice',
        stock_quantity: 40,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      // Breakfast, Lunch, Dinner
      {
        item_id: uuidv4(),
        category_id: catMap['Breakfast, Lunch, Dinner'],
        item_name: 'Chapati (2 pcs)',
        item_description: 'Soft wheat rotis served with dal',
        price: 30.00,
        image_url: 'https://placehold.co/400x300?text=Chapati',
        stock_quantity: 100,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        item_id: uuidv4(),
        category_id: catMap['Breakfast, Lunch, Dinner'],
        item_name: 'Paratha',
        item_description: 'Stuffed whole wheat paratha with curd',
        price: 40.00,
        image_url: 'https://placehold.co/400x300?text=Paratha',
        stock_quantity: 60,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      // Snacks
      {
        item_id: uuidv4(),
        category_id: catMap['Snacks'],
        item_name: 'Samosa (2 pcs)',
        item_description: 'Crispy fried samosas with chutney',
        price: 20.00,
        image_url: 'https://placehold.co/400x300?text=Samosa',
        stock_quantity: 80,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        item_id: uuidv4(),
        category_id: catMap['Snacks'],
        item_name: 'Vada Pav',
        item_description: 'Mumbai style vada pav with green chutney',
        price: 25.00,
        image_url: 'https://placehold.co/400x300?text=Vada+Pav',
        stock_quantity: 60,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      // Beverages
      {
        item_id: uuidv4(),
        category_id: catMap['Beverages'],
        item_name: 'Masala Chai',
        item_description: 'Hot spiced Indian tea',
        price: 15.00,
        image_url: 'https://placehold.co/400x300?text=Chai',
        stock_quantity: 100,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        item_id: uuidv4(),
        category_id: catMap['Beverages'],
        item_name: 'Fresh Lime Soda',
        item_description: 'Chilled lime soda sweet or salted',
        price: 30.00,
        image_url: 'https://placehold.co/400x300?text=Lime+Soda',
        stock_quantity: 50,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      // Desserts
      {
        item_id: uuidv4(),
        category_id: catMap['Desserts'],
        item_name: 'Gulab Jamun (2 pcs)',
        item_description: 'Soft milk solid dumplings in sugar syrup',
        price: 30.00,
        image_url: 'https://placehold.co/400x300?text=Gulab+Jamun',
        stock_quantity: 40,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        item_id: uuidv4(),
        category_id: catMap['Desserts'],
        item_name: 'Kheer',
        item_description: 'Creamy rice pudding with cardamom',
        price: 35.00,
        image_url: 'https://placehold.co/400x300?text=Kheer',
        stock_quantity: 30,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('items', null, {});
  }
};