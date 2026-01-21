import { Request, Response } from 'express';
import { orderItemService } from '../service/index';

const createOrderItem = async (req: Request, res: Response) => {
  try {
    const orderItem = await orderItemService.createOrderItem(req.body);
    res.status(201).json({
      success: true,
      data: orderItem,
      message: 'Order item created successfully',
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllOrderItems = async (_req: Request, res: Response) => {
  try {
    const orderItems = await orderItemService.getAllOrderItems();
    res.json({
      success: true,
      data: orderItems,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getOrderItemById = async (req: Request, res: Response) => {
  try {
    const orderItem = await orderItemService.getOrderItemById(req.params.id);
    res.json({
      success: true,
      data: orderItem,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

const getOrderItemsByUserId = async (req: Request, res: Response) => {
  try {
    const orderItems = await orderItemService.getOrderItemsByUserId(req.params.userId);
    res.json({
      success: true,
      data: orderItems,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

const getOrderItemsByOrderId = async (req: Request, res: Response) => {
  try {
    const orderItems = await orderItemService.getOrderItemsByOrderId(req.params.orderId);
    res.json({
      success: true,
      data: orderItems,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

const updateOrderItem = async (req: Request, res: Response) => {
  try {
    const orderItem = await orderItemService.updateOrderItem(req.params.id, req.body);
    res.json({
      success: true,
      data: orderItem,
      message: 'Order item updated successfully',
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteOrderItem = async (req: Request, res: Response) => {
  try {
    await orderItemService.deleteOrderItem(req.params.id);
    res.json({
      success: true,
      message: 'Order item deleted successfully',
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export default {
  createOrderItem,
  getAllOrderItems,
  getOrderItemById,
  getOrderItemsByUserId,
  getOrderItemsByOrderId,
  updateOrderItem,
  deleteOrderItem,
};