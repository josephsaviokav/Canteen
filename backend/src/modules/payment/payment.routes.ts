import express from 'express';
import paymentController from './payment.controller';
import { auth, isAdmin } from '../../middleware/index';

const paymentRouter = express.Router();

// ─── Specific routes first ────────────────────────────────────────────────────

/**
 * @swagger
 * /api/v1/payments/create-order:
 *   post:
 *     tags: [Payments]
 *     summary: Create a Razorpay order for payment
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount, orderId]
 *             properties:
 *               amount: { type: number, description: Amount in INR }
 *               orderId: { type: string, format: uuid, description: Order UUID }
 *     responses:
 *       200:
 *         description: Razorpay order created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: object
 *                   properties:
 *                     razorpayOrderId: { type: string }
 *                     amount: { type: number }
 *                     currency: { type: string, example: INR }
 *                     keyId: { type: string }
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
paymentRouter.post('/create-order', auth, paymentController.createRazorpayOrder);

/**
 * @swagger
 * /api/v1/payments/verify:
 *   post:
 *     tags: [Payments]
 *     summary: Verify Razorpay payment signature and confirm order
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [razorpayOrderId, razorpayPaymentId, razorpaySignature, paymentId]
 *             properties:
 *               razorpayOrderId: { type: string, description: Razorpay order ID }
 *               razorpayPaymentId: { type: string, description: Razorpay payment ID }
 *               razorpaySignature: { type: string, description: Razorpay signature }
 *               paymentId: { type: string, format: uuid, description: Your DB payment UUID }
 *     responses:
 *       200:
 *         description: Payment verified, order confirmed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Payment verified successfully }
 *                 data: { $ref: '#/components/schemas/Payment' }
 *       400:
 *         description: Invalid payment signature
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Payment or order not found
 */
paymentRouter.post('/verify', auth, paymentController.verifyPayment);

/**
 * @swagger
 * /api/v1/payments/failure:
 *   post:
 *     tags: [Payments]
 *     summary: Mark payment as failed and cancel order
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [paymentId, orderId]
 *             properties:
 *               paymentId: { type: string, format: uuid }
 *               orderId: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Payment marked as failed, order cancelled
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Payment marked as failed, order cancelled }
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Payment or order not found
 */
paymentRouter.post('/failure', auth, paymentController.failPayment);

/**
 * @swagger
 * /api/v1/payments/stats/overview:
 *   get:
 *     tags: [Payments]
 *     summary: Get payment statistics (Admin only)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Payment statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalPayments: { type: integer }
 *                     completedPayments: { type: integer }
 *                     pendingPayments: { type: integer }
 *                     failedPayments: { type: integer }
 *                     totalAmount: { type: number }
 *                     completedAmount: { type: number }
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
paymentRouter.get('/stats/overview', auth, isAdmin, paymentController.getPaymentStats);

/**
 * @swagger
 * /api/v1/payments/order/{orderId}:
 *   get:
 *     tags: [Payments]
 *     summary: Get payment by order ID
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Payment details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/Payment' }
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Payment not found
 */
paymentRouter.get('/order/:orderId', auth, paymentController.getPaymentByOrderId);

/**
 * @swagger
 * /api/v1/payments/user/{userId}:
 *   get:
 *     tags: [Payments]
 *     summary: Get all payments by user ID
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: List of user payments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Payment' 
 *       401:
 *         description: Unauthorized
 */
paymentRouter.get('/user/:userId', auth, paymentController.getPaymentsByUserId);

/**
 * @swagger
 * /api/v1/payments/status/{status}:
 *   get:
 *     tags: [Payments]
 *     summary: Get payments by status (Admin only)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         schema: { type: string, enum: [PENDING, COMPLETED, FAILED] }
 *     responses:
 *       200:
 *         description: List of payments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Payment'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
paymentRouter.get('/status/:status', auth, isAdmin, paymentController.getPaymentsByStatus);

// ─── Collection routes ────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/v1/payments:
 *   get:
 *     tags: [Payments]
 *     summary: Get all payments (Admin only)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: sortBy
 *         schema: { type: string }
 *       - in: query
 *         name: sortOrder
 *         schema: { type: string, enum: [ASC, DESC] }
 *     responses:
 *       200:
 *         description: List of payments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items: { $ref: '#/components/schemas/Payment' }
 *                     total: { type: integer }
 *                     page: { type: integer }
 *                     limit: { type: integer }
 *                     totalPages: { type: integer }
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
paymentRouter.get('/', auth, isAdmin, paymentController.getAllPayments);

/**
 * @swagger
 * /api/v1/payments:
 *   post:
 *     tags: [Payments]
 *     summary: Create new payment record
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [orderId, userId, paymentMethod, amount]
 *             properties:
 *               orderId: { type: string, format: uuid }
 *               userId: { type: string, format: uuid }
 *               paymentMethod: { type: string, enum: [CREDIT_CARD, UPI, NET_BANKING] }
 *               amount: { type: number, minimum: 0 }
 *               paymentStatus: { type: string, enum: [PENDING, COMPLETED, FAILED], default: PENDING }
 *     responses:
 *       201:
 *         description: Payment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Payment created successfully }
 *                 data: { $ref: '#/components/schemas/Payment' }
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
paymentRouter.post('/', auth, paymentController.createPayment);

// ─── Dynamic routes last ──────────────────────────────────────────────────────

/**
 * @swagger
 * /api/v1/payments/{id}:
 *   get:
 *     tags: [Payments]
 *     summary: Get payment by ID
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Payment details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/Payment' }
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Payment not found
 */
paymentRouter.get('/:id', auth, paymentController.getPaymentById);

/**
 * @swagger
 * /api/v1/payments/{id}:
 *   put:
 *     tags: [Payments]
 *     summary: Update payment details (Admin only)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentMethod: { type: string, enum: [CREDIT_CARD, UPI, NET_BANKING] }
 *               amount: { type: number, minimum: 0 }
 *               paymentStatus: { type: string, enum: [PENDING, COMPLETED, FAILED] }
 *     responses:
 *       200:
 *         description: Payment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/Payment' }
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Payment not found
 */
paymentRouter.put('/:id', auth, paymentController.updatePayment);

/**
 * @swagger
 * /api/v1/payments/{id}/status:
 *   patch:
 *     tags: [Payments]
 *     summary: Update payment status (Admin only)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [paymentStatus]
 *             properties:
 *               paymentStatus: { type: string, enum: [PENDING, COMPLETED, FAILED] }
 *     responses:
 *       200:
 *         description: Payment status updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/Payment' }
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: Payment not found
 */
paymentRouter.patch('/:id/status', auth, isAdmin, paymentController.updatePaymentStatus);

/**
 * @swagger
 * /api/v1/payments/{id}:
 *   delete:
 *     tags: [Payments]
 *     summary: Delete payment (Admin only)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Payment deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Payment deleted successfully }
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: Payment not found
 */
paymentRouter.delete('/:id', auth, isAdmin, paymentController.deletePayment);

export default paymentRouter;