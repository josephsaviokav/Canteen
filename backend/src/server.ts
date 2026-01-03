import dotenv from 'dotenv';
import sequelize from './config/database.js';
import app from './app.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Test DB connection
    await sequelize.authenticate();
    console.log('✓ Database connected successfully');

    // Sync models (SAFE)
    await sequelize.sync();
    console.log('✓ Database models synchronized');

    // Start server
    app.listen(PORT, () => {
      console.log(`\n${'='.repeat(40)}`);
      console.log(`✓ Server running on http://localhost:${PORT}`);
      console.log(`✓ API Base: /api/v1`);
      console.log(`${'='.repeat(40)}\n`);
    });
  } catch (error) {
    console.error('✗ Unable to start server:', error);
    process.exit(1);
  }
};

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: any) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});
