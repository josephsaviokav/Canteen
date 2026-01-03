import { Request, Response } from 'express';
import Order from '../models/Order.js';

// CREATE - Create new order
const createOrder = async (req: Request, res: Response) => {
  try {
    const { userId, totalAmount, items } = req.body;

    if (!userId || !totalAmount) {
      return res.status(400).json({ 
        success: false, 
        message: 'userId and totalAmount are required' 
      });
    }

    const order = await Order.create({
      userId,
      totalAmount,
      status: 'pending',
      items: items || [],
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order,
    });
  } catch (error: any) {
    console.error('Create Order Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message,
    });
  }
};

// READ - Get all orders
const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.findAll({
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      success: true,
      data: orders,
      count: orders.length,
    });
  } catch (error: any) {
    console.error('Get All Orders Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message,
    });
  }
};

// READ - Get order by ID
const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    console.error('Get Order Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message,
    });
  }
};

// READ - Get orders by userId
const getOrdersByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const orders = await Order.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      success: true,
      data: orders,
      count: orders.length,
    });
  } catch (error: any) {
    console.error('Get User Orders Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user orders',
      error: error.message,
    });
  }
};

// UPDATE - Update order status
const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log('Update order status - ID:', id, 'Status:', status, 'Body:', req.body);

    if (!status || !['pending', 'completed', 'canceled'].includes(status)) {
      console.log('Invalid status received:', status);
      return res.status(400).json({
        success: false,
        message: 'Valid status is required (pending, completed, canceled)',
      });
    }

    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: order,
    });
  } catch (error: any) {
    console.error('Update Order Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order',
      error: error.message,
    });
  }
};

// DELETE - Delete order
const deleteOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    await order.destroy();

    res.status(200).json({
      success: true,
      message: 'Order deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete Order Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete order',
      error: error.message,
    });
  }
};

export default{
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersByUserId,
  updateOrderStatus,
  deleteOrder
}