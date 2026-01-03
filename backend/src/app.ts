import express from 'express';
import cors from 'cors';

// Routes
import { userRouter, itemRoutes } from './routes/index.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

// Middleware
import { errorHandler } from './middleware/index.js';

const app = express();

// Global middleware
app.use(cors({
  origin: 'http://localhost:3000',
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
  });
});

// API Routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/items', itemRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/payments', paymentRoutes);

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
