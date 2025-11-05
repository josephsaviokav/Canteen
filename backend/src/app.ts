import express from 'express';
import cors from 'cors';
import { userRouter, itemRouter, paymentRouter, orderRouter, orderItemRouter } from './routes/index.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRouter);
app.use('/api/items', itemRouter);
app.use('/api/orders', orderRouter);
app.use('/api/order-items', orderItemRouter);
app.use('/api/payments', paymentRouter);

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

export default app;