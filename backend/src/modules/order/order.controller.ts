import type { Request, Response } from 'express';
import { asyncHandler } from '../../middleware/errorHandler.js';
import { ValidationError } from '../../utils/errors.js';
import { validate } from '../../utils/validate.js';
import { createOrderSchema, updateOrderSchema } from './order.dto.js';
import orderService from './order.service.js';
import Order from './order.entity.js';

//* Checkout */
const checkout = asyncHandler(async (req: Request, res: Response) => {
  const { userId, paymentMethod } = req.body;

  if (!userId) throw new ValidationError('userId is required');
  if (!paymentMethod) throw new ValidationError('paymentMethod is required');

  const result = await orderService.checkout(userId, paymentMethod);

  res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: result,
  });
});

//* Create a new order
const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const payload = validate(createOrderSchema, req.body);
  const order = await orderService.createOrder(payload);

  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    data: order,
  });
});

//* Get all orders
const getAllOrders = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, sortBy, sortOrder } = req.query;

  const orders = await orderService.getAllOrders({
    page: Number(page) || 1,
    limit: Number(limit) || 10,
    sortBy: sortBy as keyof Order,
    sortOrder: sortOrder as 'ASC' | 'DESC',
  });

  res.status(200).json({
    success: true,
    message: 'Orders retrieved successfully',
    data: orders,
  });
});

//* Get order by ID
const getOrderById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw new ValidationError('Order ID is required');
  }

  const order = await orderService.getOrderById(id as string);

  res.status(200).json({
    success: true,
    message: 'Order retrieved successfully',
    data: order,
  });
});

//* Get orders by user ID
const getOrdersByUserId = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!userId) {
    throw new ValidationError('User ID is required');
  }

  const orders = await orderService.getOrdersByUserId(userId as string);

  res.status(200).json({
    success: true,
    message: 'User orders retrieved successfully',
    data: orders,
  });
});

//* Update order
const updateOrder = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw new ValidationError('Order ID is required');
  }

  const payload = validate(updateOrderSchema, req.body);
  const order = await orderService.updateOrder(id as string, payload);

  res.status(200).json({
    success: true,
    message: 'Order updated successfully',
    data: order,
  });
});

const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!id  || !status) {
    throw new ValidationError('Order ID and status are required');
  }

  const order = await orderService.updateOrderStatus(id as string, status);

  res.status(200).json({
    success: true,
    message: 'Order status updated successfully',
    data: order,
  });
});

//* Delete order
const deleteOrder = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw new ValidationError('Order ID is required');
  }

  const result = await orderService.deleteOrder(id as string);

  res.status(200).json({
    success: true,
    message: result.message,
  });
});

export default {
  checkout,
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersByUserId,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
};
