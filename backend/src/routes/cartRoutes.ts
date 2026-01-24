import { cartController } from "../controller";
import { Router } from "express";
import { auth } from "../middleware/index";

const cartRouter = Router();

/**
 * @swagger
 * /api/v1/cart/add:
 *   post:
 *     tags: [Cart]
 *     summary: Add item to cart
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, itemId, quantity]
 *             properties:
 *               userId:
 *                 type: string
 *                 format: uuid
 *                 description: User ID
 *               itemId:
 *                 type: string
 *                 format: uuid
 *                 description: Item ID to add to cart
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 description: Quantity of items
 *     responses:
 *       201:
 *         description: Item added to cart successfully
 *       400:
 *         description: Bad request - Invalid data
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */
cartRouter.post("/add", auth, cartController.addToCart);

/**
 * @swagger
 * /api/v1/cart/{userId}:
 *   get:
 *     tags: [Cart]
 *     summary: Get all cart items for a user
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID to fetch cart items
 *     responses:
 *       200:
 *         description: Cart items retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                   userId:
 *                     type: string
 *                     format: uuid
 *                   itemId:
 *                     type: string
 *                     format: uuid
 *                   quantity:
 *                     type: integer
 *                   item:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       name:
 *                         type: string
 *                       price:
 *                         type: number
 *                       imageUrl:
 *                         type: string
 *                       available:
 *                         type: boolean
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */
cartRouter.get("/:userId", auth, cartController.getCartItems);

/**
 * @swagger
 * /api/v1/cart/update:
 *   put:
 *     tags: [Cart]
 *     summary: Update cart item quantity
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [cartItemId, quantity]
 *             properties:
 *               cartItemId:
 *                 type: string
 *                 format: uuid
 *                 description: Cart item ID to update
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 description: New quantity
 *     responses:
 *       200:
 *         description: Cart item updated successfully
 *       400:
 *         description: Bad request - Invalid data
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Cart item not found
 *       500:
 *         description: Internal server error
 */
cartRouter.put("/update", auth, cartController.updateCartItem);

/**
 * @swagger
 * /api/v1/cart/delete/{cartItemId}:
 *   delete:
 *     tags: [Cart]
 *     summary: Delete item from cart
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: cartItemId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Cart item ID to delete
 *     responses:
 *       204:
 *         description: Cart item deleted successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Cart item not found
 *       500:
 *         description: Internal server error
 */
cartRouter.delete("/delete/:cartItemId", auth, cartController.deleteCartItem);

export default cartRouter;