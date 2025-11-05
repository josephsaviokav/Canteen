import type { Request, Response } from 'express';
import {paymentService} from '../services/index.js';

const createPayment = async (req: Request, res: Response) => {
    try {
        const { orderId, amount, paymentMethod, transactionId } = req.body;

        if (!orderId || !amount || !paymentMethod) {
            return res.status(400).json({ error: 'Order ID, amount, and payment method are required' });
        }

        const payment = await paymentService.createPayment({
            orderId,
            amount,
            paymentMethod,
            transactionId,
        });

        res.status(201).json(payment);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Get all payments
const getAllPayments = async (req: Request, res: Response) => {
    try {
        const payments = await paymentService.getAllPayments();
        res.status(200).json(payments);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Get payment by ID
const getPaymentById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: 'Payment ID is required' });
        }

        const payment = await paymentService.getPaymentById(id);
        res.status(200).json(payment);
    } catch (error: any) {
        if (error.message === 'Payment not found') {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
};

// Get payment by order ID
const getPaymentByOrderId = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params;

        if (!orderId) {
            return res.status(400).json({ error: 'Order ID is required' });
        }

        const payment = await paymentService.getPaymentByOrderId(orderId);
        res.status(200).json(payment);
    } catch (error: any) {
        if (error.message === 'Payment not found for this order') {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
};

// Update payment status
const updatePaymentStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status, transactionId } = req.body;

        if (!id) {
            return res.status(400).json({ error: 'Payment ID is required' });
        }

        const payment = await paymentService.updatePaymentStatus(id, {
            status,
            transactionId,
        });

        res.status(200).json(payment);
    } catch (error: any) {
        if (error.message === 'Payment not found') {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
};

// Delete payment
const deletePayment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: 'Payment ID is required' });
        }

        const result = await paymentService.deletePayment(id);
        res.status(200).json(result);
    } catch (error: any) {
        if (error.message === 'Payment not found') {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
};

export default {
    createPayment,
    getAllPayments,
    getPaymentById,
    getPaymentByOrderId,
    updatePaymentStatus,
    deletePayment
};
