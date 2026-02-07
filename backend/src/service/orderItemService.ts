import { OrderItem, Order, Item } from '../models';
import { OrderItemCreationAttributes, OrderItemAttributes } from '../models/OrderItem';

// Create a new order item with calculated subTotal
const createOrderItem = async (data: OrderItemCreationAttributes): Promise<OrderItem> => {
  try {
    // Calculate subTotal if not provided
    const subTotal = (data.price as number) * (data.quantity as number);
    
    const orderItem = await OrderItem.create({
      ...data,
      subTotal,
    } as OrderItemCreationAttributes);
    
    return orderItem;
  } catch (error: any) {
    throw new Error(`Failed to create order item: ${error.message}`);
  }
};

// Get all order items
const getAllOrderItems = async (): Promise<OrderItem[]> => {
  try {
    const orderItems = await OrderItem.findAll({
      include: [
        {
          model: Order,
          as: 'order',
          attributes: ['id', 'status', 'totalAmount'],
        },
        {
          model: Item,
          as: 'item',
          attributes: ['id', 'name', 'price', 'imageUrl'],
        },
      ],
    });
    
    return orderItems;
  } catch (error: any) {
    throw new Error(`Failed to fetch order items: ${error.message}`);
  }
};

// Get order item by ID
const getOrderItemById = async (id: string): Promise<OrderItem | null> => {
  try {
    const orderItem = await OrderItem.findByPk(id, {
      include: [
        {
          model: Order,
          as: 'order',
          attributes: ['id', 'status', 'totalAmount'],
        },
        {
          model: Item,
          as: 'item',
          attributes: ['id', 'name', 'price', 'imageUrl'],
        },
      ],
    });
    
    if (!orderItem) {
      throw new Error('Order item not found');
    }
    
    return orderItem;
  } catch (error: any) {
    throw new Error(`Failed to fetch order item: ${error.message}`);
  }
};

const getOrderItemsByUserId = async (userId: string): Promise<OrderItem[]> => {
  try{
    const orderItems = await OrderItem.findAll({
      where: { '$order.userId$': userId },
      include: [
        {
          model: Item,
          as: 'item',
          attributes: ['id', 'name', 'price', 'imageUrl'],
        },
      ],
    });
    
    return orderItems;
  } catch (error: any) {
    throw new Error(`Failed to fetch order items for user: ${error.message}`);
  }
};

// Get order items by order ID
const getOrderItemsByOrderId = async (orderId: string): Promise<OrderItem[]> => {
  try {
    const orderItems = await OrderItem.findAll({
      where: { orderId },
      include: [
        {
          model: Item,
          as: 'item',
          attributes: ['id', 'name', 'price', 'imageUrl'],
        },
      ],
    });
    
    return orderItems;
  } catch (error: any) {
    throw new Error(`Failed to fetch order items for order: ${error.message}`);
  }
};

// Update order item with recalculated subTotal
const updateOrderItem = async (id: string, data: Partial<OrderItemAttributes>): Promise<OrderItem> => {
  try {
    const orderItem = await OrderItem.findByPk(id);
    
    if (!orderItem) {
      throw new Error('Order item not found');
    }
    
    // Recalculate subTotal if quantity or price is updated
    const updatedData = { ...data };
    const price = data.price ?? orderItem.price;
    const quantity = data.quantity ?? orderItem.quantity;
    
    updatedData.subTotal = price * quantity;
    
    await orderItem.update(updatedData);
    
    return orderItem;
  } catch (error: any) {
    throw new Error(`Failed to update order item: ${error.message}`);
  }
};

// Delete order item
const deleteOrderItem = async (id: string): Promise<void> => {
  try {
    const orderItem = await OrderItem.findByPk(id);
    
    if (!orderItem) {
      throw new Error('Order item not found');
    }
    
    await orderItem.destroy();
  } catch (error: any) {
    throw new Error(`Failed to delete order item: ${error.message}`);
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