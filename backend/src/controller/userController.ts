import type { NextFunction, Request, Response } from 'express';
import { userService } from '../service/index.js';
import { generateToken } from '../middleware/auth.js';

// Sign up a new user
const signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { firstName, lastName, email, password, phone, role } = req.body;

        // Basic validation
        if (!firstName || !lastName || !email || !password || !phone) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        const user = await userService.createUser({
            firstName,
            lastName,
            email,
            password,
            phone,
            role
        });

        // Generate JWT token (auto-login after signup)
        const token = generateToken(user.id, user.email, user.role as "customer" | "admin");

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: {
                user,
                token
            }
        });
    } catch (error) {
        next(error);
    }
};

// Sign in
const signIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        const user = await userService.signIn(email, password);

        // Generate JWT token
        const token = generateToken(user.id, user.email, user.role as "customer" | "admin");

        res.status(200).json({
            success: true,      
            message: 'Sign in successful',
            data: {
                user,
                token
            }
        });
    } catch (error) {
        next(error);
    }
};

// Get all users (admin only - will add auth middleware later)
const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await userService.getAllUsers();

        res.status(200).json({
            success: true,
            message: 'Users retrieved successfully',
            data: users
        });
    } catch (error) {
        next(error);
    }
};

// Get user by ID
const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        const user = await userService.getUserById(id);

        res.status(200).json({
            success: true,
            message: 'User retrieved successfully',
            data: user
        });
    } catch (error) {
        next(error);
    }
};

// Update user
const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, phone, email } = req.body;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        const user = await userService.updateUser(id, {
            firstName,
            lastName,
            phone,
            email
        });

        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: user
        });
    } catch (error) {
        next(error);
    }
};

// Update password
const updatePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { oldPassword, newPassword } = req.body;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Old password and new password are required'
            });
        }

        const user = await userService.updatePassword(id, oldPassword, newPassword);

        res.status(200).json({
            success: true,
            message: 'Password updated successfully',
            data: user
        });
    } catch (error) {
        next(error);
    }
};

// Delete user
const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        const result = await userService.deleteUser(id);

        res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        next(error);
    }
};

export default {
    signUp,
    signIn,
    getAllUsers,
    getUserById,
    updateUser,
    updatePassword,
    deleteUser
};
