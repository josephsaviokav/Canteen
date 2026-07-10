import type { Request, Response } from 'express';
import { asyncHandler } from '../../middleware/errorHandler.js';
import { ValidationError } from '../../utils/errors.js';
import { validate } from '../../utils/validate.js';
import { createOrderItemSchema, updateOrderItemSchema } from './orderItem.dto.js';
import orderItemService from './orderItem.service.js';
import OrderItem from './orderItem.entity.js';

// Create a new order item
const createOrderItem = asyncHandler(async (req: Request, res: Response) => {
  const payload = validate(createOrderItemSchema, req.body);
  const orderItem = await orderItemService.createOrderItem(payload);

  res.status(201).json({
    success: true,
    message: 'Order item created successfully',
    data: orderItem,
  });
});

// Get all order items with optional pagination and sorting
const getAllOrderItems = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, sortBy, sortOrder } = req.query;

  const orderItems = await orderItemService.getAllOrderItems({
    page: Number(page) || 1,
    limit: Number(limit) || 10,
    sortBy: sortBy as keyof OrderItem,
    sortOrder: sortOrder as 'ASC' | 'DESC',
  });

  res.status(200).json({
    success: true,
    message: 'Order items retrieved successfully',
    data: orderItems,
  });
});

// Get order item by ID
const getOrderItemById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw new ValidationError('Order item ID is required');
  }

  const orderItem = await orderItemService.getOrderItemById(id as string);

  res.status(200).json({
    success: true,
    message: 'Order item retrieved successfully',
    data: orderItem,
  });
});

// Get order items by order ID
const getOrderItemsByOrderId = asyncHandler(async (req: Request, res: Response) => {
  const { orderId } = req.params;

  if (!orderId) {
    throw new ValidationError('Order ID is required');
  }

  const orderItems = await orderItemService.getOrderItemsByOrderId(orderId as string);

  res.status(200).json({
    success: true,
    message: 'Order items retrieved successfully',
    data: orderItems,
  });
});

// Get order items by item ID
const getOrderItemsByItemId = asyncHandler(async (req: Request, res: Response) => {
  const { itemId } = req.params;

  if (!itemId) {
    throw new ValidationError('Item ID is required');
  }

  const orderItems = await orderItemService.getOrderItemsByItemId(itemId as string);

  res.status(200).json({
    success: true,
    message: 'Order items retrieved successfully',
    data: orderItems,
  });
});

// Update order item
const updateOrderItem = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw new ValidationError('Order item ID is required');
  }

  const payload = validate(updateOrderItemSchema, req.body);
  const orderItem = await orderItemService.updateOrderItem(id as string, payload);

  res.status(200).json({
    success: true,
    message: 'Order item updated successfully',
    data: orderItem,
  });
});

// Delete order item
const deleteOrderItem = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw new ValidationError('Order item ID is required');
  }

  const result = await orderItemService.deleteOrderItem(id as string);

  res.status(200).json({
    success: true,
    message: result.message,
  });
});

// Delete all order items for an order
const deleteOrderItemsByOrderId = asyncHandler(async (req: Request, res: Response) => {
  const { orderId } = req.params;

  if (!orderId) {
    throw new ValidationError('Order ID is required');
  }

  const result = await orderItemService.deleteOrderItemsByOrderId(orderId as string);

  res.status(200).json({
    success: true,
    message: result.message,
  });
});

export default {
  createOrderItem,
  getAllOrderItems,
  getOrderItemById,
  getOrderItemsByOrderId,
  getOrderItemsByItemId,
  updateOrderItem,
  deleteOrderItem,
  deleteOrderItemsByOrderId,
};
