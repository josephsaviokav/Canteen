import { Router } from 'express';
import { orderItemController } from '../controller/index.js';

const orderItemRouter = Router();

// Get all order items
orderItemRouter.get('/', orderItemController.getAllOrderItems);

// Get order items by order ID
orderItemRouter.get('/order/:orderId', orderItemController.getOrderItemsByOrderId);

// Get order item by ID
orderItemRouter.get('/:id', orderItemController.getOrderItemById);

// Update order item
orderItemRouter.put('/:id', orderItemController.updateOrderItem);

// Delete order item
orderItemRouter.delete('/:id', orderItemController.deleteOrderItem);

export default orderItemRouter;
