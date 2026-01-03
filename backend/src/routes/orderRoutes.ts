import express from 'express';
import { orderController } from '../controller';
import { auth } from '../middleware';

const orderRouter = express.Router();

// CRUD Routes
orderRouter.post('/',auth, orderController.createOrder);                    // CREATE
orderRouter.get('/',auth, orderController.getAllOrders);                    // READ ALL
orderRouter.get('/:id',auth, orderController.getOrderById);                 // READ ONE
orderRouter.get('/user/:userId',auth, orderController.getOrdersByUserId);   // READ BY USER
orderRouter.put('/:id/status',auth, orderController.updateOrderStatus);     // UPDATE
orderRouter.delete('/:id',auth, orderController.deleteOrder);               // DELETE

export default orderRouter;
