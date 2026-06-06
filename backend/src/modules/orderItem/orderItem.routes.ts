import express from 'express';
import orderItemController from './orderItem.controller';
import { auth, isAdmin } from '../../middleware/index';

const orderItemRouter = express.Router();

// ─── Specific routes first ────────────────────────────────────────────────────

/**
 * @swagger
 * /api/v1/order-items/order/{orderId}:
 *   get:
 *     tags: [Order Items]
 *     summary: Get all items in an order
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: List of order items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/OrderItem'
 *       401:
 *         description: Unauthorized
 */
orderItemRouter.get('/order/:orderId', auth, orderItemController.getOrderItemsByOrderId);

/**
 * @swagger
 * /api/v1/order-items/item/{itemId}:
 *   get:
 *     tags: [Order Items]
 *     summary: Get all orders containing a specific item (Admin only)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: List of order items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/OrderItem'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
orderItemRouter.get('/item/:itemId', auth, isAdmin, orderItemController.getOrderItemsByItemId);

// ─── Collection routes ────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/v1/order-items:
 *   get:
 *     tags: [Order Items]
 *     summary: Get all order items (Admin only)
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
 *         description: List of order items
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
 *                       items: { $ref: '#/components/schemas/OrderItem' }
 *                     total: { type: integer }
 *                     page: { type: integer }
 *                     limit: { type: integer }
 *                     totalPages: { type: integer }
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
orderItemRouter.get('/', auth, isAdmin, orderItemController.getAllOrderItems);

/**
 * @swagger
 * /api/v1/order-items:
 *   post:
 *     tags: [Order Items]
 *     summary: Create new order item (Admin only)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [orderId, itemId, quantity, unitPrice, subtotal]
 *             properties:
 *               orderId: { type: string, format: uuid }
 *               itemId: { type: string, format: uuid }
 *               quantity: { type: integer, minimum: 1 }
 *               unitPrice: { type: number, minimum: 0 }
 *               subtotal: { type: number, minimum: 0 }
 *     responses:
 *       201:
 *         description: Order item created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Order item created successfully }
 *                 data: { $ref: '#/components/schemas/OrderItem' }
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
orderItemRouter.post('/', auth, isAdmin, orderItemController.createOrderItem);

// ─── Dynamic routes last ──────────────────────────────────────────────────────

/**
 * @swagger
 * /api/v1/order-items/{id}:
 *   get:
 *     tags: [Order Items]
 *     summary: Get order item by ID
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Order item details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/OrderItem' }
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order item not found
 */
orderItemRouter.get('/:id', auth, orderItemController.getOrderItemById);

/**
 * @swagger
 * /api/v1/order-items/{id}:
 *   put:
 *     tags: [Order Items]
 *     summary: Update order item (Admin only)
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
 *               quantity: { type: integer, minimum: 1 }
 *               unitPrice: { type: number, minimum: 0 }
 *               subtotal: { type: number, minimum: 0 }
 *     responses:
 *       200:
 *         description: Order item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Order item updated successfully }
 *                 data: { $ref: '#/components/schemas/OrderItem' }
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: Order item not found
 */
orderItemRouter.put('/:id', auth, isAdmin, orderItemController.updateOrderItem);

/**
 * @swagger
 * /api/v1/order-items/order/{orderId}/all:
 *   delete:
 *     tags: [Order Items]
 *     summary: Delete all items from an order (Admin only)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Order items deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string }
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
orderItemRouter.delete('/order/:orderId/all', auth, isAdmin, orderItemController.deleteOrderItemsByOrderId);

/**
 * @swagger
 * /api/v1/order-items/{id}:
 *   delete:
 *     tags: [Order Items]
 *     summary: Delete order item (Admin only)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Order item deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Order item deleted successfully }
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: Order item not found
 */
orderItemRouter.delete('/:id', auth, isAdmin, orderItemController.deleteOrderItem);

export default orderItemRouter;