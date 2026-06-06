import type { NextFunction, Request, Response } from 'express';

import { generateToken } from '../../middleware/authorize';
import { ValidationError } from '../../utils/errors';
import {
    createUserSchema,
    forgotPasswordSchema,
    signInSchema,
    updatePasswordSchema,
    updateUserSchema,
} from './user.dto';
import userService from './user.service';
import { validate } from '../../utils/validate';
import { asyncHandler } from '../../middleware/errorHandler';
import User from './user.entity';


//  Sign up a new user
const signUp = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const payload = validate(createUserSchema, req.body);
    const user = await userService.createUser(payload);
    const token = generateToken({ userId: user.userId, email: user.email, role: user.role });

    res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: { user, token },
    });
});

// sign in
const signIn = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const payload = validate(signInSchema, req.body);
    const user = await userService.signIn(payload);
    const token = generateToken({ userId: user.userId, email: user.email, role: user.role });

    res.status(200).json({
        success: true,
        message: 'Sign in successful',
        data: { user, token },
    });
});

// Get all users (admin only)
const getAllUsers = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { page, limit, sortBy, sortOrder } = req.query

    const users = await userService.getAllUsers({
        page: Number(page) || 1,
        limit: Number(limit) || 10,
        sortBy: sortBy as keyof User,
        sortOrder: sortOrder as "ASC" | "DESC",
    });

    res.status(200).json({
        success: true,
        message: 'Users retrieved successfully',
        data: users,
    });
});

// Get all customers (admin only)
const getAllCustomers = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { page, limit, sortBy, sortOrder } = req.query;

    const customers = await userService.getAllCustomers({
        page: Number(page) || 1,
        limit: Number(limit) || 10,
        sortBy: sortBy as keyof User,
        sortOrder: sortOrder as "ASC" | "DESC",
    });

    res.status(200).json({
        success: true,
        message: 'Customers retrieved successfully',
        data: customers,
    });
});

// Get user by ID
const getUserById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (!id) {
        throw new ValidationError('User ID is required');
    }

    const user = await userService.getUserById(id);

    res.status(200).json({
        success: true,
        message: 'User retrieved successfully',
        data: user,
    });
});

// Update user details
const updateUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (!id) {
        throw new ValidationError('User ID is required');
    }

    const payload = validate(updateUserSchema, req.body);
    const user = await userService.updateUser(id, payload);

    res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: user,
    });
});

// Update user password
const updatePassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (!id) {
        throw new ValidationError('User ID is required');
    }

    const payload = validate(updatePasswordSchema, req.body);
    const user = await userService.updatePassword(id, payload);

    res.status(200).json({
        success: true,
        message: 'Password updated successfully',
        data: user,
    });
});

// Forgot password
const forgotPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const payload = validate(forgotPasswordSchema, req.body);
    const user = await userService.forgotPassword(payload);

    res.status(200).json({
        success: true,
        message: 'Password reset successfully',
        data: user,
    });
});

// Delete user (admin only)
const deleteUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (!id) {
        throw new ValidationError('User ID is required');
    }

    const result = await userService.deleteUser(id);

    res.status(200).json({
        success: true,
        message: result.message,
    });
});

export default {
    signUp,
    signIn,
    getAllUsers,
    getAllCustomers,
    getUserById,
    updateUser,
    updatePassword,
    forgotPassword,
    deleteUser,
};
