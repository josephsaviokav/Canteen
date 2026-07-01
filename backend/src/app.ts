import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

// Routes
import {userRouter} from './modules/user';
import {itemRouter} from './modules/item';
import {orderRouter} from './modules/order';
import {paymentRouter} from './modules/payment';
import {orderItemRouter} from './modules/orderItem';
import {cartRouter} from './modules/cart';

// Middleware
import { errorHandler, requestLogger, globalRateLimiter, notFoundHandler } from './middleware/index';
import { categoryRouter } from './modules/category/index.js';

const app = express();

// Middleware - Security & Logging (before routes)
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use(globalRateLimiter);
app.use(requestLogger);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

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
app.use('/api/v1/items', itemRouter);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/payments', paymentRouter);
app.use('/api/v1/order-items', orderItemRouter);
app.use('/api/v1/cart', cartRouter);
app.use('/api/v1/cart-items', cartRouter);
app.use('/api/v1/categories', categoryRouter);

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

export default app;
