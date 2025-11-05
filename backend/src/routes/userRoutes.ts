import { Router } from 'express';
import { userController } from '../controller/index.js';

const userRouter = Router();

// CRUD routes
userRouter.post('/', userController.createUser);           // Create user
userRouter.get('/', userController.getAllUsers);           // Get all users
userRouter.get('/:id', userController.getUserById);        // Get user by ID
userRouter.put('/:id', userController.updateUser);         // Update user
userRouter.delete('/:id', userController.deleteUser);      // Delete user

export default userRouter;