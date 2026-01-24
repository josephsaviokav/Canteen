import express from 'express';
import { orderController } from '../controller';
import { auth } from '../middleware';

const orderRouter = express.Router();

/**
 * @swagger
 * /api/v1/orders/checkout:
 *   post:
 *     tags: [Orders]
 *     summary: Create order from cart items (Checkout)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId]
 *             properties:
 *               userId:
 *                 type: string
 *                 format: uuid
 *                 description: User ID to checkout cart
 *     responses:
 *       201:
 *         description: Order created successfully from cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     userId:
 *                       type: string
 *                       format: uuid
 *                     totalAmount:
 *                       type: number
 *                     status:
 *                       type: string
 *                     orderItems:
 *                       type: array
 *                       items:
 *                         type: object
 *       400:
 *         description: Bad request - Cart is empty or invalid userId
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
orderRouter.post('/checkout', auth, orderController.createOrderFromCart);

/**
 * @swagger
 * /api/v1/orders:
 *   post:
 *     tags: [Orders]
 *     summary: Create new order
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, totalAmount, items]
 *             properties:
 *               userId: { type: integer }
 *               totalAmount: { type: number }
 *               items: 
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     itemId: { type: integer }
 *                     quantity: { type: integer }
 *                     price: { type: number }
 *     responses:
 *       201: { description: Order created }
 */
orderRouter.post('/',auth, orderController.createOrder);

/**
 * @swagger
 * /api/v1/orders:
 *   get:
 *     tags: [Orders]
 *     summary: Get all orders
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: List of all orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Order' }
 */
orderRouter.get('/',auth, orderController.getAllOrders);

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
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Order details }
 *       404: { description: Order not found }
 */
orderRouter.get('/:id',auth, orderController.getOrderById);

/**
 * @swagger
 * /api/v1/orders/user/{userId}:
 *   get:
 *     tags: [Orders]
 *     summary: Get all orders for a user
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: User's orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Order' }
 */
orderRouter.get('/user/:userId',auth, orderController.getOrdersByUserId);

/**
 * @swagger
 * /api/v1/orders/{id}/status:
 *   put:
 *     tags: [Orders]
 *     summary: Update order status
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, preparing, ready, completed, cancelled]
 *     responses:
 *       200: { description: Order status updated }
 */
orderRouter.put('/:id/status',auth, orderController.updateOrderStatus);

/**
 * @swagger
 * /api/v1/orders/{id}:
 *   delete:
 *     tags: [Orders]
 *     summary: Delete order
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Order deleted }
 */
orderRouter.delete('/:id',auth, orderController.deleteOrder);

export default orderRouter;
