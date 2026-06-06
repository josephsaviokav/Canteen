import { Router } from "express";
import cartController from "./cart.controller.js";
import { auth, isAdmin } from "../../middleware/index.js";

const cartRouter = Router();

/**
 * @swagger
 * /api/v1/carts/user/{userId}:
 *   get:
 *     tags: [Carts]
 *     summary: Get cart by user ID
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Cart details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/Cart' }
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Cart not found
 */
cartRouter.get('/user/:userId', auth, cartController.getCartByUserId);

/**
 * @swagger
 * /api/v1/carts:
 *   get:
 *     tags: [Carts]
 *     summary: Get all carts (Admin only)
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
 *         description: List of all carts
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
 *                       items: { $ref: '#/components/schemas/Cart' }
 *                     total: { type: integer }
 *                     page: { type: integer }
 *                     limit: { type: integer }
 *                     totalPages: { type: integer }
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
cartRouter.get('/', auth, isAdmin, cartController.getAllCarts);

/**
 * @swagger
 * /api/v1/carts:
 *   post:
 *     tags: [Carts]
 *     summary: Create new cart for a user
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId]
 *             properties:
 *               userId: { type: string, format: uuid, description: User UUID }
 *     responses:
 *       201:
 *         description: Cart created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Cart created successfully }
 *                 data: { $ref: '#/components/schemas/Cart' }
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Cart already exists for this user
 */
cartRouter.post('/', auth, cartController.createCart);

export default cartRouter;