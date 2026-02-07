import { Router } from 'express';
import { userController } from '../controller/index';
import { auth, isAdmin } from '../middleware/index';

const userRouter = Router();

/**
 * @swagger
 * /api/v1/users/signup:
 *   post:
 *     tags: [Users]
 *     summary: Register a new user
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, email, password]
 *             properties:
 *               username: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       201: { description: User created successfully }
 *       400: { description: Bad request }
 */
userRouter.post('/signup', userController.signUp);

/**
 * @swagger
 * /api/v1/users/signin:
 *   post:
 *     tags: [Users]
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
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200: { description: Login successful, returns JWT token }
 *       401: { description: Invalid credentials }
 */
userRouter.post('/signin', userController.signIn);

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     tags: [Users]
 *     summary: Get all users (Admin only)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: List of users }
 *       401: { description: Unauthorized }
 *       403: { description: Forbidden - Admin only }
 */
userRouter.get('/', auth, isAdmin, userController.getAllUsers);

userRouter.get('/customers', auth, isAdmin, userController.getAllCustomers);

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
 *         schema: { type: integer }
 *     responses:
 *       200: { description: User details }
 *       404: { description: User not found }
 */
userRouter.get('/:id', auth, userController.getUserById);

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
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username: { type: string }
 *               email: { type: string }
 *     responses:
 *       200: { description: User updated }
 */
userRouter.put('/:id', auth, userController.updateUser);

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
 *         schema: { type: integer }
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
 *       200: { description: Password updated }
 */
userRouter.put('/:id/password', auth, userController.updatePassword);

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
 *         schema: { type: integer }
 *     responses:
 *       200: { description: User deleted }
 *       403: { description: Forbidden - Admin only }
 */
userRouter.delete('/:id', auth, isAdmin, userController.deleteUser);

export default userRouter;