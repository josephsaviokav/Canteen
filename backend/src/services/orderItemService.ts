import OrderItem from '../models/orderItem.js';

const getAllOrderItems = async () => {
    return await OrderItem.findAll();
};

// Get order items by order ID
const getOrderItemsByOrderId = async (orderId: string) => {
    return await OrderItem.findAll({
        where: { orderId },
    });
};

// Get order item by ID
const getOrderItemById = async (id: string) => {
    const orderItem = await OrderItem.findByPk(id);
    if (!orderItem) {
        throw new Error('Order item not found');
    }
    return orderItem;
};

// Update order item quantity
const updateOrderItem = async (id: string, data: { quantity?: number }) => {
    const orderItem = await OrderItem.findByPk(id);
    if (!orderItem) {
        throw new Error('Order item not found');
    }

    if (data.quantity !== undefined) {
        orderItem.quantity = data.quantity;
        orderItem.subtotal = orderItem.price * data.quantity;
        await orderItem.save();
    }

    return orderItem;
};

// Delete order item
const deleteOrderItem = async (id: string) => {
    const orderItem = await OrderItem.findByPk(id);
    if (!orderItem) {
        throw new Error('Order item not found');
    }

    await orderItem.destroy();
    return { message: 'Order item deleted successfully' };
};

export default {
    getAllOrderItems,   
    getOrderItemsByOrderId,
    getOrderItemById,
    updateOrderItem,
    deleteOrderItem,    
}
