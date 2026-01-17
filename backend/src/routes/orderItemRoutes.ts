import express from 'express';
import { orderItemController } from '../controller/index';

const orderItemRouter = express.Router();

/**
 * @swagger
 * /api/v1/order-items:
 *   get:
 *     tags: [Order Items]
 *     summary: Get all order items
 *     responses:
 *       200:
 *         description: List of all order items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/OrderItem' }
 */
orderItemRouter.get('/', orderItemController.getAllOrderItems);

/**
 * @swagger
 * /api/v1/order-items:
 *   post:
 *     tags: [Order Items]
 *     summary: Create a new order item
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [orderId, itemId, quantity, price]
 *             properties:
 *               orderId: { type: integer }
 *               itemId: { type: integer }
 *               quantity: { type: integer }
 *               price: { type: number }
 *     responses:
 *       201: { description: Order item created }
 */
orderItemRouter.post('/', orderItemController.createOrderItem);

/**
 * @swagger
 * /api/v1/order-items/order/{orderId}:
 *   get:
 *     tags: [Order Items]
 *     summary: Get all items for a specific order
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Order items for the order
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/OrderItem' }
 */
orderItemRouter.get('/order/:orderId', orderItemController.getOrderItemsByOrderId);

/**
 * @swagger
 * /api/v1/order-items/user/{userId}:
 *   get:
 *     tags: [Order Items]
 *     summary: Get order items by user ID
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Order item details }
 *       404: { description: Order item not found }
 */
orderItemRouter.get('/user/:userId', orderItemController.getOrderItemsByUserId);

/**
 * @swagger
 * /api/v1/order-items/{id}:
 *   get:
 *     tags: [Order Items]
 *     summary: Get order item by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Order item details }
 *       404: { description: Order item not found }
 */
orderItemRouter.get('/:id', orderItemController.getOrderItemById);

/**
 * @swagger
 * /api/v1/order-items/{id}:
 *   put:
 *     tags: [Order Items]
 *     summary: Update order item
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity: { type: integer }
 *               price: { type: number }
 *     responses:
 *       200: { description: Order item updated }
 */
orderItemRouter.put('/:id', orderItemController.updateOrderItem);

/**
 * @swagger
 * /api/v1/order-items/{id}:
 *   delete:
 *     tags: [Order Items]
 *     summary: Delete order item
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Order item deleted }
 */
orderItemRouter.delete('/:id', orderItemController.deleteOrderItem);

export default orderItemRouter;
