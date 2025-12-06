import { Router } from 'express';
import { userController } from '../controller/index.js';
import { auth, isAdmin } from '../middleware/index.js';

const userRouter = Router();

// Public routes (no authentication required)
userRouter.post('/signup', userController.signUp);
userRouter.post('/signin', userController.signIn);

// Protected routes (authentication required)
userRouter.get('/', auth, isAdmin, userController.getAllUsers);
userRouter.get('/:id', auth, userController.getUserById);
userRouter.put('/:id', auth, userController.updateUser);
userRouter.put('/:id/password', auth, userController.updatePassword);
userRouter.delete('/:id', auth, isAdmin, userController.deleteUser);

export default userRouter;