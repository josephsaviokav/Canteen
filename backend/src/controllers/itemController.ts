import { Request, Response } from 'express';
import * as ItemService from '../service/itemService.js';

export const createItem = async (req: Request, res: Response) => {
  try {
    const item = await ItemService.createItem(req.body);
    res.status(201).json(item);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllItems = async (_req: Request, res: Response) => {
  const items = await ItemService.getAllItems();
  res.json(items);
};

export const getItemById = async (req: Request, res: Response) => {
  try {
    const item = await ItemService.getItemById(req.params.id);
    res.json(item);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
};

export const deleteItem = async (req: Request, res: Response) => {
  try {
    await ItemService.deleteItem(req.params.id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
};
