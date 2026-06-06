import express from 'express';
import itemController from './item.controller';
import { auth, isAdmin } from '../../middleware/index';
import { upload } from '../../utils/upload';

const itemRouter = express.Router();

/**
 * @swagger
 * /api/v1/items:
 *   get:
 *     tags: [Items]
 *     summary: Get all menu items
 *     security: []
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
 *         description: List of all items
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
 *                       items: { $ref: '#/components/schemas/Item' }
 *                     total: { type: integer }
 *                     page: { type: integer }
 *                     limit: { type: integer }
 *                     totalPages: { type: integer }
 *       500:
 *         description: Server error
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
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Item details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/Item' }
 *       404:
 *         description: Item not found
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [categoryId, itemName, price, stockQuantity]
 *             properties:
 *               image: { type: string, format: binary, description: Item image file }
 *               categoryId: { type: string, format: uuid }
 *               itemName: { type: string, maxLength: 255 }
 *               itemDescription: { type: string, maxLength: 255 }
 *               price: { type: number, minimum: 0 }
 *               stockQuantity: { type: integer, minimum: 0 }
 *               isAvailable: { type: boolean, default: true }
 *     responses:
 *       201:
 *         description: Item created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Item created successfully }
 *                 data: { $ref: '#/components/schemas/Item' }
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
itemRouter.post('/', auth, isAdmin, upload.single('image'), itemController.createItem);

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
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image: { type: string, format: binary, description: Item image file }
 *               categoryId: { type: string, format: uuid }
 *               itemName: { type: string, maxLength: 255 }
 *               itemDescription: { type: string, maxLength: 255 }
 *               price: { type: number, minimum: 0 }
 *               stockQuantity: { type: integer, minimum: 0 }
 *               isAvailable: { type: boolean }
 *     responses:
 *       200:
 *         description: Item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/Item' }
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: Item not found
 */
itemRouter.put('/:id', auth, isAdmin, upload.single('image'), itemController.updateItem);

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
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Item deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Item deleted successfully }
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: Item not found
 */
itemRouter.delete('/:id', auth, isAdmin, itemController.deleteItem);

export default itemRouter;