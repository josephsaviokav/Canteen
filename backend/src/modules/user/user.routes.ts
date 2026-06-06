import { Router } from 'express';
import userController from './user.controller';
import { auth, isAdmin, authRateLimiter } from '../../middleware/index';

const userRouter = Router();

// ─── Auth routes (no token required) ─────────────────────────────────────────

/**
 * @swagger
 * /api/v1/users/signup:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firstName, lastName, email, password, phone]
 *             properties:
 *               firstName: { type: string }
 *               lastName: { type: string }
 *               email: { type: string, format: email }
 *               password: { type: string, format: password }
 *               phone: { type: string, example: "9876543210" }
 *               role: { type: string, enum: [admin, customer] }
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: object
 *                   properties:
 *                     user: { $ref: '#/components/schemas/User' }
 *                     token: { type: string }
 *       400: { description: Validation error }
 *       409: { description: Email already exists }
 */
userRouter.post('/signup', authRateLimiter, userController.signUp);

/**
 * @swagger
 * /api/v1/users/signin:
 *   post:
 *     tags: [Auth]
 *     summary: Login user
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string, format: password }
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: object
 *                   properties:
 *                     user: { $ref: '#/components/schemas/User' }
 *                     token: { type: string }
 *       401: { description: Invalid credentials }
 */
userRouter.post('/signin', authRateLimiter, userController.signIn);

/**
 * @swagger
 * /api/v1/users/forgot-password:
 *   post:
 *     tags: [Auth]
 *     summary: Reset password using email
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, newPassword]
 *             properties:
 *               email: { type: string, format: email }
 *               newPassword: { type: string, format: password }
 *     responses:
 *       200: { description: Password reset successfully }
 *       404: { description: User not found }
 */
userRouter.post('/forgot-password', userController.forgotPassword);

// ─── Specific routes before dynamic ──────────────────────────────────────────

/**
 * @swagger
 * /api/v1/users/customers:
 *   get:
 *     tags: [Users]
 *     summary: Get all customers (Admin only)
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
 *         description: List of customers
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
 *                       items: { $ref: '#/components/schemas/User' }
 *                     total: { type: integer }
 *                     page: { type: integer }
 *                     limit: { type: integer }
 *                     totalPages: { type: integer }
 *       401: { description: Unauthorized }
 *       403: { description: Forbidden - Admin only }
 */
userRouter.get('/customers', auth, isAdmin, userController.getAllCustomers);

// ─── Collection routes ────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     tags: [Users]
 *     summary: Get all users (Admin only)
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
 *         description: List of users
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
 *                       items: { $ref: '#/components/schemas/User' }
 *                     total: { type: integer }
 *                     page: { type: integer }
 *                     limit: { type: integer }
 *                     totalPages: { type: integer }
 *       401: { description: Unauthorized }
 *       403: { description: Forbidden - Admin only }
 */
userRouter.get('/', auth, isAdmin, userController.getAllUsers);

// ─── Dynamic routes last ──────────────────────────────────────────────────────

/**
 * @swagger
 * /api/v1/users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Get user by ID
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/User' }
 *       401: { description: Unauthorized }
 *       404: { description: User not found }
 */
userRouter.get('/:id', auth, userController.getUserById);

/**
 * @swagger
 * /api/v1/users/{id}/password:
 *   put:
 *     tags: [Users]
 *     summary: Change password
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
 *             required: [oldPassword, newPassword]
 *             properties:
 *               oldPassword: { type: string }
 *               newPassword: { type: string }
 *     responses:
 *       200: { description: Password updated successfully }
 *       400: { description: Current password incorrect }
 *       401: { description: Unauthorized }
 *       404: { description: User not found }
 */
userRouter.put('/:id/password', auth, userController.updatePassword);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   put:
 *     tags: [Users]
 *     summary: Update user
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
 *               firstName: { type: string }
 *               lastName: { type: string }
 *               email: { type: string, format: email }
 *               phone: { type: string, example: "9876543210" }
 *     responses:
 *       200: { description: User updated successfully }
 *       400: { description: Validation error }
 *       401: { description: Unauthorized }
 *       404: { description: User not found }
 */
userRouter.put('/:id', auth, userController.updateUser);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Delete user (Admin only)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: User deleted successfully }
 *       401: { description: Unauthorized }
 *       403: { description: Forbidden - Admin only }
 *       404: { description: User not found }
 */
userRouter.delete('/:id', auth, isAdmin, userController.deleteUser);

export default userRouter;