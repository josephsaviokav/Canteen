import type { Request, Response } from 'express';
import { asyncHandler } from '../../middleware/errorHandler';
import { ValidationError } from '../../utils/errors';
import { validate } from '../../utils/validate';
import { createPaymentSchema, PaymentStatusEnum, updatePaymentSchema } from './payment.dto';
import paymentService from './payment.service';
import Payment from './payment.entity';

// Create Razorpay order
const createRazorpayOrder = asyncHandler(async (req: Request, res: Response) => {
    const { amount, orderId } = req.body;

    if (!amount || !orderId) {
        throw new ValidationError('Amount and orderId are required');
    }

    const razorpayOrder = await paymentService.createRazorpayOrder(amount, orderId);

    res.status(200).json({
        success: true,
        message: 'Razorpay order created successfully',
        data: razorpayOrder,
    });
});

// Verify payment after frontend completes payment
const verifyPayment = asyncHandler(async (req: Request, res: Response) => {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, paymentId } = req.body;

    const payment = await paymentService.verifyPayment(
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        paymentId
    );

    res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        data: payment,
    });
});

// Mark payment as failed and cancel order
const failPayment = asyncHandler(async (req: Request, res: Response) => {
  const { paymentId, orderId } = req.body;

  if (!paymentId || !orderId) {
      throw new ValidationError('paymentId and orderId are required');
  }

  await paymentService.failPayment(paymentId, orderId);

  res.status(200).json({
      success: true,
      message: 'Payment marked as failed, order cancelled',
  });
});

// Create a new payment
const createPayment = asyncHandler(async (req: Request, res: Response) => {
  const payload = validate(createPaymentSchema, req.body);
  const payment = await paymentService.createPayment(payload);

  res.status(201).json({
    success: true,
    message: 'Payment created successfully',
    data: payment,
  });
});

// Get all payments with pagination and sorting
const getAllPayments = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, sortBy, sortOrder } = req.query;

  const payments = await paymentService.getAllPayments({
    page: Number(page) || 1,
    limit: Number(limit) || 10,
    sortBy: sortBy as keyof Payment,
    sortOrder: sortOrder as "ASC" | "DESC",
  });

  res.status(200).json({
    success: true,
    message: 'Payments retrieved successfully',
    data: payments,
  });
});

// Get payment by ID
const getPaymentById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw new ValidationError('Payment ID is required');
  }

  const payment = await paymentService.getPaymentById(id);

  res.status(200).json({
    success: true,
    message: 'Payment retrieved successfully',
    data: payment,
  });
});

// Get payment by order ID
const getPaymentByOrderId = asyncHandler(async (req: Request, res: Response) => {
  const { orderId } = req.params;

  if (!orderId) {
    throw new ValidationError('Order ID is required');
  }

  const payment = await paymentService.getPaymentByOrderId(orderId);

  res.status(200).json({
    success: true,
    message: 'Payment retrieved successfully',
    data: payment,
  });
});

// Get all payments by user ID
const getPaymentsByUserId = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!userId) {
    throw new ValidationError('User ID is required');
  }

  const payments = await paymentService.getPaymentsByUserId(userId);

  res.status(200).json({
    success: true,
    message: 'User payments retrieved successfully',
    data: payments,
  });
});

// Get all payments by status
const getPaymentsByStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.params;

  if (!status) {
    throw new ValidationError('Payment status is required');
  }

  const payments = await paymentService.getPaymentsByStatus(status);

  res.status(200).json({
    success: true,
    message: 'Payments retrieved successfully',
    data: payments,
  });
});

// Update payment details
const updatePayment = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw new ValidationError('Payment ID is required');
  }

  const payload = validate(updatePaymentSchema, req.body);
  const payment = await paymentService.updatePayment(id, payload);

  res.status(200).json({
    success: true,
    message: 'Payment updated successfully',
    data: payment,
  });
});

// Update payment status
const updatePaymentStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { paymentStatus } = validate(updatePaymentSchema, req.body);

  if (!id) {
    throw new ValidationError('Payment ID is required');
  }

  const payment = await paymentService.updatePaymentStatus(id, paymentStatus as PaymentStatusEnum);

  res.status(200).json({
    success: true,
    message: 'Payment status updated successfully',
    data: payment,
  });
});

// Delete payment
const deletePayment = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw new ValidationError('Payment ID is required');
  }

  const result = await paymentService.deletePayment(id);

  res.status(200).json({
    success: true,
    message: result.message,
  });
});

// Get payment statistics
const getPaymentStats = asyncHandler(async (req: Request, res: Response) => {
  const stats = await paymentService.getPaymentStats();

  res.status(200).json({
    success: true,
    message: 'Payment statistics retrieved successfully',
    data: stats,
  });
});

export default {
  createRazorpayOrder,
  verifyPayment,
  failPayment,
  createPayment,
  getAllPayments,
  getPaymentById,
  getPaymentByOrderId,
  getPaymentsByUserId,
  getPaymentsByStatus,
  updatePayment,
  updatePaymentStatus,
  deletePayment,
  getPaymentStats,
};
