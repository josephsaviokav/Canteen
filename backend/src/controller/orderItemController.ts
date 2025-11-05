import type { Request, Response } from 'express';
import {orderItemService} from '../services/index.js';

const getAllOrderItems = async (req: Request, res: Response) => {
    try {
        const orderItems = await orderItemService.getAllOrderItems();
        res.status(200).json(orderItems);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Get order items by order ID
const getOrderItemsByOrderId = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params;

        if (!orderId) {
            return res.status(400).json({ error: 'Order ID is required' });
        }

        const orderItems = await orderItemService.getOrderItemsByOrderId(orderId);
        res.status(200).json(orderItems);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Get order item by ID
const getOrderItemById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: 'Order item ID is required' });
        }

        const orderItem = await orderItemService.getOrderItemById(id);
        res.status(200).json(orderItem);
    } catch (error: any) {
        if (error.message === 'Order item not found') {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
};

// Update order item
const updateOrderItem = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        if (!id) {
            return res.status(400).json({ error: 'Order item ID is required' });
        }

        const orderItem = await orderItemService.updateOrderItem(id, { quantity });
        res.status(200).json(orderItem);
    } catch (error: any) {
        if (error.message === 'Order item not found') {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
};

// Delete order item
const deleteOrderItem = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: 'Order item ID is required' });
        }

        const result = await orderItemService.deleteOrderItem(id);
        res.status(200).json(result);
    } catch (error: any) {
        if (error.message === 'Order item not found') {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
};

export default {
    getAllOrderItems,
    getOrderItemsByOrderId,
    getOrderItemById,
    updateOrderItem,
    deleteOrderItem
};
