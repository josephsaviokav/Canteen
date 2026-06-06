import { Router } from 'express';
import cartItemController from './cartItem.controller';
import { auth, isAdmin } from '../../middleware/index';

const cartItemRouter = Router();

/**
 * @swagger
 * /api/v1/cart-items/cart/{cartId}:
 *   get:
 *     tags: [Cart Items]
 *     summary: Get all items in a cart
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: cartId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: List of cart items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CartItem'
 *       401:
 *         description: Unauthorized
 */
cartItemRouter.get("/cart/:cartId", auth, cartItemController.getCartItemsByCartId);

/**
 * @swagger
 * /api/v1/cart-items:
 *   get:
 *     tags: [Cart Items]
 *     summary: Get all cart items (Admin only)
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
 *         description: List of all cart items
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
 *                       items: { $ref: '#/components/schemas/CartItem' }
 *                     total: { type: integer }
 *                     page: { type: integer }
 *                     limit: { type: integer }
 *                     totalPages: { type: integer }
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
cartItemRouter.get("/", auth, isAdmin, cartItemController.getAllCartItems);

/**
 * @swagger
 * /api/v1/cart-items:
 *   post:
 *     tags: [Cart Items]
 *     summary: Add item to cart
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [cartId, itemId, quantity]
 *             properties:
 *               cartId: { type: string, format: uuid }
 *               itemId: { type: string, format: uuid }
 *               quantity: { type: integer, minimum: 1 }
 *     responses:
 *       201:
 *         description: Cart item added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Cart item added successfully }
 *                 data: { $ref: '#/components/schemas/CartItem' }
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
cartItemRouter.post("/", auth, cartItemController.createCartItem);

/**
 * @swagger
 * /api/v1/cart-items/{cartItemId}:
 *   get:
 *     tags: [Cart Items]
 *     summary: Get cart item by ID
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: cartItemId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Cart item details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/CartItem' }
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Cart item not found
 */
cartItemRouter.get("/:cartItemId", auth, cartItemController.getCartItemById);

/**
 * @swagger
 * /api/v1/cart-items/{cartItemId}:
 *   put:
 *     tags: [Cart Items]
 *     summary: Update cart item quantity
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: cartItemId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity: { type: integer, minimum: 1 }
 *     responses:
 *       200:
 *         description: Cart item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Cart item updated successfully }
 *                 data: { $ref: '#/components/schemas/CartItem' }
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Cart item not found
 */
cartItemRouter.put("/:cartItemId", auth, cartItemController.updateCartItem);

/**
 * @swagger
 * /api/v1/cart-items/{cartItemId}:
 *   delete:
 *     tags: [Cart Items]
 *     summary: Remove item from cart
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: cartItemId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Cart item deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Cart item deleted successfully }
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Cart item not found
 */
cartItemRouter.delete("/:cartItemId", auth, cartItemController.deleteCartItem);

export default cartItemRouter;