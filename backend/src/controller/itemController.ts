import { Request, Response } from 'express';
import { itemService } from '../service/index';

const createItem = async (req: Request, res: Response) => {
  try {
    const item = await itemService.createItem(req.body);
    res.status(201).json({
      success: true,
      data: item,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllItems = async (_req: Request, res: Response) => {
  const items = await itemService.getAllItems();
  res.json({
    success: true,
    data: items,
  });
};

const getItemById = async (req: Request, res: Response) => {
  try {
    const item = await itemService.getItemById(req.params.id);
    res.json({
      success: true,
      data: item,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

const updateItem = async (req: Request, res: Response) => {
  try {
    const item = await itemService.updateItem(req.params.id, req.body);
    res.json({
      success: true,
      data: item,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteItem = async (req: Request, res: Response) => {
  try {
    await itemService.deleteItem(req.params.id);
    res.json({
      success: true,
      message: 'Item deleted successfully',
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export default {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
};