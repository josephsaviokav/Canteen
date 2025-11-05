import { Router } from 'express';
import { paymentController } from '../controller/index.js';

const paymentRouter = Router();

// Create payment
paymentRouter.post('/', paymentController.createPayment);

// Get all payments
paymentRouter.get('/', paymentController.getAllPayments);

// Get payment by ID
paymentRouter.get('/:id', paymentController.getPaymentById);

// Get payment by order ID
paymentRouter.get('/order/:orderId', paymentController.getPaymentByOrderId);

// Update payment status
paymentRouter.put('/:id', paymentController.updatePaymentStatus);

// Delete payment
paymentRouter.delete('/:id', paymentController.deletePayment);

export default paymentRouter;
