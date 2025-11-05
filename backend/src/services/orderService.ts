import Order from '../models/order.js';
import OrderItem from '../models/orderItem.js';
import Item from '../models/item.js';

const createOrder = async (data: {
    userId: string;
    items: Array<{ itemId: string; quantity: number }>;
  }) => {
    if (!data.userId || !data.items || data.items.length === 0) {
      throw new Error('User ID and items are required');
    }

    // Calculate total amount
    let totalAmount = 0;
    const orderItems = [];

    for (const item of data.items) {
      // Fetch item details
      const menuItem = await Item.findByPk(item.itemId);
      if (!menuItem) {
        throw new Error(`Item with ID ${item.itemId} not found`);
      }

      const subtotal = menuItem.price * item.quantity;
      totalAmount += subtotal;

      orderItems.push({
        itemId: item.itemId,
        quantity: item.quantity,
        price: menuItem.price,
        subtotal,
      });
    }

    // Create order
    const order = await Order.create({
      userId: data.userId,
      amount: totalAmount,
      status: 'pending',
    });

    // Create order items
    for (const orderItem of orderItems) {
      await OrderItem.create({
        orderId: order.id,
        ...orderItem,
      });
    }

    return order;
  };

  // Get all orders
const getAllOrders = async () => {
    return await Order.findAll({
      order: [['createdAt', 'DESC']],
    });
  };

  // Get order by ID with items
const getOrderById = async (id: string) => {
    const order = await Order.findByPk(id);
    if (!order) {
      throw new Error('Order not found');
    }

    // Get order items
    const items = await OrderItem.findAll({
      where: { orderId: id },
    });

    return {
      ...order.toJSON(),
      items,
    };
  };

  // Get orders by user ID
 const getOrdersByUserId = async (userId: string) => {
    return await Order.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });
  };

  // Update order status
const updateOrderStatus = async (id: string, status: 'pending' | 'completed' | 'cancelled') => {
    const order = await Order.findByPk(id);
    if (!order) {
      throw new Error('Order not found');
    }

    order.status = status;
    await order.save();

    return order;
  };

  // Delete order
const deleteOrder = async (id: string) => {
    const order = await Order.findByPk(id);
    if (!order) {
      throw new Error('Order not found');
    }

    await order.destroy();
    return { message: 'Order deleted successfully' };
  };

  export default {
    createOrder,
    getAllOrders,
    getOrderById,
    getOrdersByUserId,
    updateOrderStatus,
    deleteOrder,
  };