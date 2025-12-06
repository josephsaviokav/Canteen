import express from 'express';
import cors from 'cors';

// Import models to register them
import { User , Item, Order , OrderItem } from './models/index.js';

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

// TODO: Add your routes here
// app.use('/api/users', userRoutes);
// app.use('/api/items', itemRoutes);
// app.use('/api/orders', orderRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

export default app;
