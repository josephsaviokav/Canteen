import express from 'express';
import cors from 'cors';

// Import routes
import { userRouter } from './routes/index.js';
import { orderRouter } from './routes/index.js';
import { paymentRouter } from './routes/index.js';

// Import middleware
import { errorHandler } from './middleware/index.js';

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Canteen API Server is running',
    timestamp: new Date().toISOString(),
    endpoints: {
      users: '/api/v1/users',
      orders: '/api/v1/orders',
      payments: '/api/v1/payments',
    },
  });
});

// API Routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/payments', paymentRouter);
// TODO: Add more routes
// app.use('/api/items', itemRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Global error handler (MUST be last)
app.use(errorHandler);

export default app;
