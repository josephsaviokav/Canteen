import { Router } from 'express';
import { orderController } from '../controller/index.js';

const orderRouter = Router();

// Create order
orderRouter.post('/', orderController.createOrder);

// Get all orders
orderRouter.get('/', orderController.getAllOrders);

// Get order by ID
orderRouter.get('/:id', orderController.getOrderById);

// Get orders by user ID
orderRouter.get('/user/:userId', orderController.getOrdersByUserId);

// Update order status
orderRouter.put('/:id', orderController.updateOrderStatus);

// Delete order
orderRouter.delete('/:id', orderController.deleteOrder);

export default orderRouter;
