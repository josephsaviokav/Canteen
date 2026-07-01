'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    // get category IDs from DB
    const cats = await queryInterface.sequelize.query(
      `SELECT "categoryId", "categoryName" FROM categories`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const catMap = {};
    cats.forEach(c => { catMap[c.categoryName] = c.categoryId; });

    await queryInterface.bulkInsert('items', [
      // Lunch & Dinner
      {
        itemId: uuidv4(),
        categoryId: catMap['Lunch, Dinner'],
        itemName: 'Veg Rice',
        itemDescription: 'Steamed rice with mixed vegetable curry',
        price: 60.00,
        imageUrl: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        stockQuantity: 50,
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        itemId: uuidv4(),
        categoryId: catMap['Lunch, Dinner'],
        itemName: 'Chicken Curry',
        itemDescription: 'Spicy chicken curry',
        price: 90.00,
        imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        stockQuantity: 40,
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Breakfast, Lunch, Dinner
      {
        itemId: uuidv4(),
        categoryId: catMap['Breakfast, Lunch, Dinner'],
        itemName: 'Chapati (2 pcs)',
        itemDescription: 'Soft wheat rotis served with dal',
        price: 30.00,
        imageUrl: 'https://images.unsplash.com/photo-1633442496018-6872fbfbbcc7?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        stockQuantity: 100,
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        itemId: uuidv4(),
        categoryId: catMap['Breakfast, Lunch, Dinner'],
        itemName: 'Paratha',
        itemDescription: 'Stuffed whole wheat paratha with curd',
        price: 40.00,
        imageUrl: 'https://images.unsplash.com/photo-1599232288126-7dbd2127db14?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        stockQuantity: 60,
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Snacks
      {
        itemId: uuidv4(),
        categoryId: catMap['Snacks'],
        itemName: 'Samosa (2 pcs)',
        itemDescription: 'Crispy fried samosas with chutney',
        price: 20.00,
        imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        stockQuantity: 80,
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        itemId: uuidv4(),
        categoryId: catMap['Snacks'],
        itemName: 'Vada Pav',
        itemDescription: 'Mumbai style vada pav with green chutney',
        price: 25.00,
        imageUrl: 'https://images.unsplash.com/photo-1750767397012-3413ba4fdbc7?q=80&w=1506&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        stockQuantity: 60,
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Beverages
      {
        itemId: uuidv4(),
        categoryId: catMap['Beverages'],
        itemName: 'Masala Chai',
        itemDescription: 'Hot spiced Indian tea',
        price: 15.00,
        imageUrl: 'https://images.unsplash.com/photo-1750767397012-3413ba4fdbc7?q=80&w=1506&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        stockQuantity: 100,
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        itemId: uuidv4(),
        categoryId: catMap['Beverages'],
        itemName: 'Fresh Lime Soda',
        itemDescription: 'Chilled lime soda sweet or salted',
        price: 30.00,
        imageUrl: 'https://images.unsplash.com/photo-1651993737174-6890c1daef5b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        stockQuantity: 50,
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Desserts
      {
        itemId: uuidv4(),
        categoryId: catMap['Desserts'],
        itemName: 'Gulab Jamun (2 pcs)',
        itemDescription: 'Soft milk solid dumplings in sugar syrup',
        price: 30.00,
        imageUrl: 'https://images.unsplash.com/photo-1666190092159-3171cf0fbb12?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        stockQuantity: 40,
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        itemId: uuidv4(),
        categoryId: catMap['Snacks'],
        itemName: 'Cream Bun',
        itemDescription: 'Creamy filled soft bun',
        price: 20.00,
        imageUrl: 'https://images.unsplash.com/photo-1741004420618-209c60a86d58?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        stockQuantity: 30,
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('items', null, {});
  }
};