import type { Request, Response } from 'express';
import { asyncHandler } from '../../middleware/errorHandler';
import { ValidationError } from '../../utils/errors';
import { validate } from '../../utils/validate';
import { createCartItemSchema } from './cartItem.dto';
import cartItemService from './cartItem.service';
import CartItem from './cartItem.entity';

// create cart item
const createCartItem = asyncHandler(async (req: Request, res: Response) => {
    console.log('Received request to create cart item with body:', req.body);
    const payload = validate(createCartItemSchema, req.body);
    // console.log('Creating cart item with payload:', payload);
    const cartItem = await cartItemService.createCartItem(payload);

    res.status(201).json({
        success: true,
        message: 'Cart item created successfully',
        data: cartItem,
    });
});

// get cart item by ID
const getCartItemById = asyncHandler(async (req: Request, res: Response) => {
    const { cartItemId } = req.params;
    const cartItem = await cartItemService.getCartItemById(cartItemId);
    res.status(200).json({
        success: true,
        message: 'Cart item retrieved successfully',
        data: cartItem,
    });
});

// get cart items by cartId
const getCartItemsByCartId = asyncHandler(async (req: Request, res: Response) => {
    const { cartId } = req.params;

    if (!cartId) {
        throw new ValidationError('Cart ID is required');
    }

    const cartItems = await cartItemService.getCartItemsByCartId(cartId);

    res.status(200).json({
        success: true,
        message: 'Cart items retrieved successfully',
        data: cartItems,
    });
});

// update cart item
const updateCartItem = asyncHandler(async (req: Request, res: Response) => {
    const { cartItemId } = req.params;

    if (!cartItemId) {
        throw new ValidationError('Cart item ID is required');
    }

    const payload = validate(createCartItemSchema, req.body);
    const updatedCartItem = await cartItemService.updateCartItem(cartItemId, payload);

    res.status(200).json({
        success: true,
        message: 'Cart item updated successfully',
        data: updatedCartItem,
    });
});

// get all cart items
const getAllCartItems = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, sortBy, sortOrder } = req.query;
    const cartItems = await cartItemService.getAllCartItems({
        page: Number(page) || 1,
        limit: Number(limit) || 10,
        sortBy: sortBy as keyof CartItem,
        sortOrder: sortOrder as 'ASC' | 'DESC',
    });

    res.status(200).json({
        success: true,
        message: 'Cart items retrieved successfully',
        data: cartItems,
    });
});

// delete cart item
const deleteCartItem = asyncHandler(async (req: Request, res: Response) => {
    const { cartItemId } = req.params;

    if (!cartItemId) {
        throw new ValidationError('Cart item ID is required');
    }

    const result = await cartItemService.deleteCartItem(cartItemId);

    res.status(200).json({
        success: true,
        message: result.message,
    });
});

export default {
    createCartItem,
    getCartItemById,
    getCartItemsByCartId,
    updateCartItem,
    getAllCartItems,
    deleteCartItem,
};