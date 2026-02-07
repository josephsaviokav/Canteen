import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

// Routes
import { userRouter, itemRoutes, orderRouter, paymentRouter, orderItemRoutes, cartRouter } from './routes/index';

// Middleware
import { errorHandler } from './middleware/index';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Swagger JSON
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Canteen API Server is running',
    timestamp: new Date().toISOString(),
    documentation: 'http://localhost:5000/api-docs',
    endpoints: [
      'GET /api/v1/users',
      'GET /api/v1/items',
      'GET /api/v1/orders',
      'GET /api/v1/order-items',
      'GET /api/v1/payments'
    ]
  });
});

// API Routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/items', itemRoutes);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/payments', paymentRouter);
app.use('/api/v1/order-items', orderItemRoutes);
app.use('/api/v1/cart', cartRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Global error handler
app.use(errorHandler);

export default app;
