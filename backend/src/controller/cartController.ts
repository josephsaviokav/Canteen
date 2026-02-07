import { cartService } from "../service";
import { Request, Response } from "express";

const addToCart = async (req: Request, res: Response) => {
    try {
        const { userId, itemId, quantity } = req.body;
        const cartItem = await cartService.insertcartItem(userId, itemId, quantity);
        res.status(201).json(cartItem);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

const getCartItems = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const cartItems = await cartService.getCartItemsByUserId(userId);
        res.status(200).json(cartItems);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

const updateCartItem = async (req: Request, res: Response) => {
    try {
        const { cartItemId, quantity } = req.body;
        const updatedCartItem = await cartService.updateCartItemQuantity(cartItemId, quantity);
        res.status(200).json(updatedCartItem);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

const deleteCartItem = async (req: Request, res: Response) => {
    try {
        const { cartItemId } = req.params;
        await cartService.deleteCartItem(cartItemId);
        res.status(204).send();
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export default { addToCart, getCartItems, updateCartItem, deleteCartItem };