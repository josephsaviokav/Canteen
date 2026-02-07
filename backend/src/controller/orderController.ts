import { Request, Response } from 'express';
import { Order, OrderItem, Cart, Item, User } from '../models/index';

// CREATE ORDER FROM CART - Checkout function
const createOrderFromCart = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'userId is required' 
      });
    }

    // Get all cart items for the user with item details
    const cartItems = await Cart.findAll({ 
      where: { userId },
      include: [{
        model: Item,
        as: 'item',
        attributes: ['id', 'name', 'price', 'imageUrl', 'available']
      }]
    }) as any[];

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // Calculate total amount
    const totalAmount = cartItems.reduce((sum, cartItem: any) => {
      return sum + (cartItem.item.price * cartItem.quantity);
    }, 0);

    // Create the order
    const order = await Order.create({
      userId,
      totalAmount,
      status: 'pending',
    });

    // Create order items from cart items
    const orderItemsData = cartItems.map((cartItem: any) => ({
      orderId: order.id,
      itemId: cartItem.itemId,
      quantity: cartItem.quantity,
      price: cartItem.item.price,
      subTotal: cartItem.item.price * cartItem.quantity
    }));

    await OrderItem.bulkCreate(orderItemsData);

    // Clear the cart after successful order creation
    await Cart.destroy({ where: { userId } });

    // Fetch the created order with order items and item details
    const createdOrder = await Order.findByPk(order.id, {
      include: [{
        model: OrderItem,
        as: 'orderItems',
        include: [{
          model: Item,
          as: 'item',
          attributes: ['id', 'name', 'price', 'imageUrl']
        }]
      }]
    });

    // Transform the data to match frontend expectations
    const orderData = (createdOrder as any).toJSON();
    const transformedOrder = {
      ...orderData,
      items: orderData.orderItems?.map((oi: any) => {
        if (!oi.item) {
          return {
            id: oi.itemId,
            name: 'Unknown Item',
            price: oi.price,
            quantity: oi.quantity,
            imageUrl: null
          };
        }
        return {
          id: oi.item.id,
          name: oi.item.name,
          price: oi.price,
          quantity: oi.quantity,
          imageUrl: oi.item.imageUrl
        };
      }) || []
    };

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: transformedOrder,
    });
  } catch (error: any) {
    console.error('Create Order From Cart Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order from cart',
      error: error.message,
    });
  }
};

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
    console.log('Fetching all orders...');
    const orders = await Order.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'role']
        },
        {
          model: OrderItem,
          as: 'orderItems',
          include: [{
            model: Item,
            as: 'item',
            attributes: ['id', 'name', 'price', 'imageUrl']
          }]
        }
      ],
      order: [['createdAt', 'DESC']],
    });

    console.log(`Found ${orders.length} orders`);

    // Transform the data to match frontend expectations
    const transformedOrders = orders.map((order: any) => {
      const orderData = order.toJSON();
      return {
        ...orderData,
        items: orderData.orderItems?.map((oi: any) => {
          if (!oi.item) {
            return {
              id: oi.itemId,
              name: 'Unknown Item',
              price: oi.price,
              quantity: oi.quantity,
              imageUrl: null
            };
          }
          return {
            id: oi.item.id,
            name: oi.item.name,
            price: oi.price,
            quantity: oi.quantity,
            imageUrl: oi.item.imageUrl
          };
        }) || []
      };
    });

    res.status(200).json({
      success: true,
      data: transformedOrders,
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

    const order = await Order.findByPk(id, {
      include: [{
        model: OrderItem,
        as: 'orderItems',
        include: [{
          model: Item,
          as: 'item',
          attributes: ['id', 'name', 'price', 'imageUrl']
        }]
      }]
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Transform the data to match frontend expectations
    const orderData = (order as any).toJSON();
    const transformedOrder = {
      ...orderData,
      items: orderData.orderItems?.map((oi: any) => {
        if (!oi.item) {
          return {
            id: oi.itemId,
            name: 'Unknown Item',
            price: oi.price,
            quantity: oi.quantity,
            imageUrl: null
          };
        }
        return {
          id: oi.item.id,
          name: oi.item.name,
          price: oi.price,
          quantity: oi.quantity,
          imageUrl: oi.item.imageUrl
        };
      }) || []
    };

    res.status(200).json({
      success: true,
      data: transformedOrder,
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
      include: [{
        model: OrderItem,
        as: 'orderItems',
        include: [{
          model: Item,
          as: 'item',
          attributes: ['id', 'name', 'price', 'imageUrl']
        }]
      }],
      order: [['createdAt', 'DESC']],
    });

    // Transform the data to match frontend expectations
    const transformedOrders = orders.map((order: any) => {
      const orderData = order.toJSON();
      return {
        ...orderData,
        items: orderData.orderItems?.map((oi: any) => {
          if (!oi.item) {
            return {
              id: oi.itemId,
              name: 'Unknown Item',
              price: oi.price,
              quantity: oi.quantity,
              imageUrl: null
            };
          }
          return {
            id: oi.item.id,
            name: oi.item.name,
            price: oi.price,
            quantity: oi.quantity,
            imageUrl: oi.item.imageUrl
          };
        }) || []
      };
    });

    res.status(200).json({
      success: true,
      data: transformedOrders,
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
  createOrderFromCart,
  getAllOrders,
  getOrderById,
  getOrdersByUserId,
  updateOrderStatus,
  deleteOrder
}