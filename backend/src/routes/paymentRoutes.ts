import express from 'express';
import { paymentController } from '../controller';
import { auth } from '../middleware';

const paymentRouter = express.Router();

paymentRouter.post('/process', auth, paymentController.processPayment);
paymentRouter.get('/order/:orderId', auth, paymentController.getPaymentByOrderId);
paymentRouter.get('/', auth, paymentController.getAllPayments);

export default paymentRouter;
