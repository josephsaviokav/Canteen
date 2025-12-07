import express from 'express';
import cors from 'cors';

// Import routes
import { userRouter } from './routes/index.js';

// Import middleware
import { errorHandler } from './middleware/index.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Canteen API Server is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/v1/users', userRouter);
// TODO: Add more routes
// app.use('/api/items', itemRoutes);
// app.use('/api/orders', orderRoutes);

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
