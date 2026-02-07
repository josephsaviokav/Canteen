import express from 'express';
import { itemController } from '../controller/index';

import { auth, isAdmin } from '../middleware/index';

const itemRouter = express.Router();

/**
 * @swagger
 * /api/v1/items:
 *   get:
 *     tags: [Items]
 *     summary: Get all menu items
 *     security: []
 *     responses:
 *       200:
 *         description: List of all items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Item' }
 */
itemRouter.get('/', itemController.getAllItems);

/**
 * @swagger
 * /api/v1/items/{id}:
 *   get:
 *     tags: [Items]
 *     summary: Get item by ID
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Item details }
 *       404: { description: Item not found }
 */
itemRouter.get('/:id', itemController.getItemById);

/**
 * @swagger
 * /api/v1/items:
 *   post:
 *     tags: [Items]
 *     summary: Create new item (Admin only)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, price]
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               price: { type: number }
 *               category: { type: string }
 *               imageUrl: { type: string }
 *               available: { type: boolean }
 *     responses:
 *       201: { description: Item created }
 *       403: { description: Forbidden - Admin only }
 */
itemRouter.post('/', auth, isAdmin, itemController.createItem);

/**
 * @swagger
 * /api/v1/items/{id}:
 *   put:
 *     tags: [Items]
 *     summary: Update item (Admin only)
 *     security: [{ bearerAuth: [] }]
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
 *               name: { type: string }
 *               description: { type: string }
 *               price: { type: number }
 *               category: { type: string }
 *               imageUrl: { type: string }
 *               available: { type: boolean }
 *     responses:
 *       200: { description: Item updated }
 *       403: { description: Forbidden - Admin only }
 */
itemRouter.put('/:id', auth, isAdmin, itemController.updateItem);

/**
 * @swagger
 * /api/v1/items/{id}:
 *   delete:
 *     tags: [Items]
 *     summary: Delete item (Admin only)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Item deleted }
 *       403: { description: Forbidden - Admin only }
 */
itemRouter.delete('/:id', auth, isAdmin, itemController.deleteItem);

export default itemRouter;