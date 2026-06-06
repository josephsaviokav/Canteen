import express from 'express';
import orderController from './order.controller';
import { auth, isAdmin } from '../../middleware/index';

const orderRouter = express.Router();

// ─── Specific routes first ────────────────────────────────────────────────────

/**
 * @swagger
 * /api/v1/orders/checkout:
 *   post:
 *     tags: [Orders]
 *     summary: Checkout - convert cart to order and initiate payment
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, paymentMethod]
 *             properties:
 *               userId: { type: string, format: uuid }
 *               paymentMethod: { type: string, enum: [CREDIT_CARD, UPI, NET_BANKING] }
 *     responses:
 *       201:
 *         description: Order placed and Razorpay order created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Order placed successfully }
 *                 data:
 *                   type: object
 *                   properties:
 *                     order: { $ref: '#/components/schemas/Order' }
 *                     razorpayOrderId: { type: string }
 *                     amount: { type: number }
 *                     currency: { type: string, example: INR }
 *                     keyId: { type: string }
 *       400:
 *         description: Cart is empty or validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Cart not found
 */
orderRouter.post('/checkout', auth, orderController.checkout);

/**
 * @swagger
 * /api/v1/orders/user/{userId}:
 *   get:
 *     tags: [Orders]
 *     summary: Get orders by user ID
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: List of user orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 */
orderRouter.get('/user/:userId', auth, orderController.getOrdersByUserId);

// ─── Collection routes ────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/v1/orders:
 *   get:
 *     tags: [Orders]
 *     summary: Get all orders (Admin only)
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
 *         description: List of orders
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
 *                       items: { $ref: '#/components/schemas/Order' }
 *                     total: { type: integer }
 *                     page: { type: integer }
 *                     limit: { type: integer }
 *                     totalPages: { type: integer }
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
orderRouter.get('/', auth, isAdmin, orderController.getAllOrders);

/**
 * @swagger
 * /api/v1/orders:
 *   post:
 *     tags: [Orders]
 *     summary: Create new order manually (Admin only)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, totalAmount]
 *             properties:
 *               userId: { type: string, format: uuid }
 *               totalAmount: { type: number, minimum: 0 }
 *               placedAt: { type: string, format: date-time }
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Order created successfully }
 *                 data: { $ref: '#/components/schemas/Order' }
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
orderRouter.post('/', auth, isAdmin, orderController.createOrder);

// ─── Dynamic routes last ──────────────────────────────────────────────────────

/**
 * @swagger
 * /api/v1/orders/{id}:
 *   get:
 *     tags: [Orders]
 *     summary: Get order by ID
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Order details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/Order' }
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 */
orderRouter.get('/:id', auth, orderController.getOrderById);

/**
 * @swagger
 * /api/v1/orders/{id}/status:
 *   patch:
 *     tags: [Orders]
 *     summary: Update order status (Admin only)
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
 *             required: [status]
 *             properties:
 *               status: { type: string, enum: [PENDING, CONFIRMED, CANCELLED] }
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/Order' }
 *       400:
 *         description: Invalid status transition
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: Order not found
 */
orderRouter.patch('/:id/status', auth, isAdmin, orderController.updateOrderStatus);

/**
 * @swagger
 * /api/v1/orders/{id}:
 *   put:
 *     tags: [Orders]
 *     summary: Update order (Admin only)
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
 *               totalAmount: { type: number, minimum: 0 }
 *               placedAt: { type: string, format: date-time }
 *               status: { type: string, enum: [PENDING, CONFIRMED, CANCELLED] }
 *     responses:
 *       200:
 *         description: Order updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/Order' }
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: Order not found
 */
orderRouter.put('/:id', auth, isAdmin, orderController.updateOrder);

/**
 * @swagger
 * /api/v1/orders/{id}:
 *   delete:
 *     tags: [Orders]
 *     summary: Delete order (Admin only)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Order deleted successfully }
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: Order not found
 */
orderRouter.delete('/:id', auth, isAdmin, orderController.deleteOrder);

export default orderRouter;