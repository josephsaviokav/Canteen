import type { Request, Response } from 'express';
import { asyncHandler } from '../../middleware/errorHandler.js';
import { ValidationError } from '../../utils/errors.js';
import { validate } from '../../utils/validate.js';
import { createCartSchema } from './cart.dto.js';
import cartService from './cart.service.js';
import Cart from './cart.entity.js';

// create cart
const createCart = asyncHandler(async (req: Request, res: Response) => {
    const payload = validate(createCartSchema, req.body);
    console.log('Creating cart with payload:', payload);
    const cart = await cartService.createCart(payload);

    res.status(201).json({
        success: true,
        message: 'Cart created successfully',
        data: cart,
    });
});

// get cart by userId
const getCartByUserId = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;

    if (!userId) {
        throw new ValidationError('User ID is required');
    }

    const cart = await cartService.getCartByUserId(userId as string);

    res.status(200).json({
        success: true,
        message: 'Cart retrieved successfully',
        data: cart,
    });
});

// get all carts
const getAllCarts = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, sortBy, sortOrder } = req.query;
    const carts = await cartService.getAllCarts(
        {
            page: Number(page) || 1,
            limit: Number(limit) || 10,
            sortBy: sortBy as keyof Cart,
            sortOrder: sortOrder as 'ASC' | 'DESC' ,
        }
    );

    res.status(200).json({
        success: true,
        message: 'Carts retrieved successfully',
        data: carts,
    });
});

export default {
    createCart,
    getCartByUserId,
    getAllCarts,
};