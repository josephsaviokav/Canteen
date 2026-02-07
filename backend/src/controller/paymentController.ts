import { Request, Response } from 'express';
import Payment from '../models/Payment';
import Order from '../models/Order';

// Process payment
const processPayment = async (req: Request, res: Response) => {
  try {
    const { orderId, amount, cardNumber, cvv, expiryDate, cardholder } = req.body;

    if (!orderId || !amount || !cardNumber || !cvv) {
      return res.status(400).json({
        success: false,
        message: 'All payment fields are required',
      });
    }

    // Check if order exists
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Simulate payment processing (90% success rate)
    const isSuccess = Math.random() < 0.9;

    if (isSuccess) {
      const transactionId = `TXN-${Date.now()}`;
      const lastFour = cardNumber.slice(-4);

      const payment = await Payment.create({
        orderId,
        amount,
        status: 'completed',
        transactionId,
        lastFour,
      });

      // Update order status to completed
      order.status = 'completed';
      await order.save();

      res.status(200).json({
        success: true,
        message: 'Payment processed successfully',
        data: {
          payment,
          transactionId,
        },
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment declined. Please try again.',
      });
    }
  } catch (error: any) {
    console.error('Payment Processing Error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment processing failed',
      error: error.message,
    });
  }
};

// Get payment by order ID
const getPaymentByOrderId = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    const payment = await Payment.findOne({ where: { orderId } });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      });
    }

    res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error: any) {
    console.error('Get Payment Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment',
      error: error.message,
    });
  }
};

// Get all payments
const getAllPayments = async (req: Request, res: Response) => {
  try {
    const payments = await Payment.findAll({
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      success: true,
      data: payments,
      count: payments.length,
    });
  } catch (error: any) {
    console.error('Get All Payments Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payments',
      error: error.message,
    });
  }
};

export default {
  processPayment,
  getPaymentByOrderId,
  getAllPayments,
};