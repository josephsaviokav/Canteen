import express from 'express';
import { paymentController } from '../controller';
import { auth } from '../middleware';

const paymentRouter = express.Router();

/**
 * @swagger
 * /api/v1/payments/process:
 *   post:
 *     tags: [Payments]
 *     summary: Process payment for an order
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [orderId, amount]
 *             properties:
 *               orderId: { type: integer }
 *               amount: { type: number }
 *               cardNumber: { type: string }
 *               cardholderName: { type: string }
 *               expiryDate: { type: string }
 *               cvv: { type: string }
 *     responses:
 *       200: { description: Payment processed successfully }
 *       400: { description: Payment failed }
 */
paymentRouter.post('/process', auth, paymentController.processPayment);

/**
 * @swagger
 * /api/v1/payments/order/{orderId}:
 *   get:
 *     tags: [Payments]
 *     summary: Get payment details for an order
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Payment details
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Payment' }
 *       404: { description: Payment not found }
 */
paymentRouter.get('/order/:orderId', auth, paymentController.getPaymentByOrderId);

/**
 * @swagger
 * /api/v1/payments:
 *   get:
 *     tags: [Payments]
 *     summary: Get all payments
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: List of all payments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Payment' }
 */
paymentRouter.get('/', auth, paymentController.getAllPayments);

export default paymentRouter;
