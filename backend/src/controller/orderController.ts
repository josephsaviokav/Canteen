import type { Request, Response } from 'express';
import {orderService} from '../services/index.js';

const createOrder = async (req: Request, res: Response) => {
    try {
        const { userId, items } = req.body;

        if (!userId || !items) {
            return res.status(400).json({ error: 'User ID and items are required' });
        }

        const order = await orderService.createOrder({ userId, items });
        res.status(201).json(order);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Get all orders
const getAllOrders = async (req: Request, res: Response) => {
    try {
        const orders = await orderService.getAllOrders();
        res.status(200).json(orders);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Get order by ID
const getOrderById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: 'Order ID is required' });
        }

        const order = await orderService.getOrderById(id);
        res.status(200).json(order);
    } catch (error: any) {
        if (error.message === 'Order not found') {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
};

// Get orders by user ID
const getOrdersByUserId = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const orders = await orderService.getOrdersByUserId(userId);
        res.status(200).json(orders);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Update order status
const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!id) {
            return res.status(400).json({ error: 'Order ID is required' });
        }

        if (!status) {
            return res.status(400).json({ error: 'Status is required' });
        }

        const order = await orderService.updateOrderStatus(id, status);
        res.status(200).json(order);
    } catch (error: any) {
        if (error.message === 'Order not found') {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
};

// Delete order
const deleteOrder = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: 'Order ID is required' });
        }

        const result = await orderService.deleteOrder(id);
        res.status(200).json(result);
    } catch (error: any) {
        if (error.message === 'Order not found') {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
};

export default {
    createOrder,
    getAllOrders,
    getOrderById,
    getOrdersByUserId,
    updateOrderStatus,
    deleteOrder
};
