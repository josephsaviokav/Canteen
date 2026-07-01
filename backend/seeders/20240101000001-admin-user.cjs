'use strict';

const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const adminId = uuidv4();
const cartId = uuidv4();

module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('Admin@123', 10);

    await queryInterface.bulkInsert('users', [{
      userId: adminId,
      firstName: 'Super',
      lastName: 'Admin',
      email: 'admin@canteen.com',
      password: hashedPassword,
      phone: '9876543210',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    }]);

    // await queryInterface.bulkInsert('carts', [{
    //   cart_id: cartId,
    //   user_id: adminId,
    //   created_at: new Date(),
    //   updated_at: new Date(),
    // }]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('carts', { userId: adminId });
    await queryInterface.bulkDelete('users', { email: 'admin@canteen.com' });
  }
};