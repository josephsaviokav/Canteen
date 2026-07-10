import type { Request, Response } from 'express';
import { asyncHandler } from '../../middleware/errorHandler.js';
import { ValidationError } from '../../utils/errors.js';
import { validate } from '../../utils/validate.js';
import { createItemSchema, updateItemSchema } from './item.dto.js';
import itemService from './item.service.js';
import Item from './item.entity.js';
import { uploadImage } from '../../utils/cloudinary.js';

// Create a new item
const createItem = asyncHandler(async (req: Request, res: Response) => {
  let imageUrl: string | undefined;

  if (req.file) {
    imageUrl = await uploadImage(req.file.buffer, 'canteen/items');
  }

  const payload = validate(createItemSchema, { ...req.body, imageUrl });
  const item = await itemService.createItem(payload);

  res.status(201).json({
    success: true,
    message: 'Item created successfully',
    data: item,
  });
});

// Get all items
const getAllItems = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, sortBy, sortOrder } = req.query;
  const items = await itemService.getAllItems({
    page: Number(page) || 1,
    limit: Number(limit) || 10,
    sortBy: sortBy as keyof Item,
    sortOrder: sortOrder as 'ASC' | 'DESC',
  });

  res.status(200).json({
    success: true,
    message: 'Items retrieved successfully',
    data: items,
  });
});

// Get item by ID
const getItemById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw new ValidationError('Item ID is required');
  }

  const item = await itemService.getItemById(id as string);

  res.status(200).json({
    success: true,
    message: 'Item retrieved successfully',
    data: item,
  });
});

// Update item
const updateItem = asyncHandler(async (req: Request, res: Response) => {
  let imageUrl: string | undefined;
  const { id } = req.params;

  if (!id) {
    throw new ValidationError('Item ID is required');
  }

  if (req.file) {
    imageUrl = await uploadImage(req.file.buffer, 'canteen/items');
  }

  const payload = validate(updateItemSchema, { ...req.body, imageUrl });
  const item = await itemService.updateItem(id as string, payload);

  res.status(200).json({
    success: true,
    message: 'Item updated successfully',
    data: item,
  });
});

// Delete item
const deleteItem = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw new ValidationError('Item ID is required');
  }

  const result = await itemService.deleteItem(id as string);

  res.status(200).json({
    success: true,
    message: result.message,
  });
});

export default {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
};