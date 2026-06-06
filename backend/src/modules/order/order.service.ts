import Order from './order.entity';
import { NotFoundError, ValidationError } from '../../utils/errors';
import type { CreateOrderDto, UpdateOrderDto, OrderDto } from './order.dto';
import orderRepository from './order.repository';
import { PaginationOptions, PaginatedResult } from '../../utils/pagination';
import cartRepository from '../cart/cart.repository';
import cartItemRepository from '../cartItem/cartItem.repository';
import Item from '../item/item.entity';
import { Sequelize } from 'sequelize';
import sequelize from '../../config/database';
import orderItemRepository from '../orderItem/orderItem.repository';
import paymentRepository from '../payment/payment.repository';
import CartItem from '../cartItem/cartItem.entity';
import razorpay from '../../config/razorpay';

const toOrderDto = (order: Order): OrderDto => order.toJSON() as OrderDto;

// Checkout
export interface CheckoutResult {
  order: OrderDto;
  razorpayOrderId: string;
  amount: number;
  currency: string;
  keyId: string | undefined;
}

const checkout = async (userId: string, paymentMethod: string): Promise<CheckoutResult> => {
  // get cart for user
  const cart = await cartRepository.findByUserId(userId);
  if (!cart) {
    throw new NotFoundError('Cart not found for the given userId');
  }

  // get items from cart
  const cartItems = await cartItemRepository.findAllByCartIdWithItems(cart.cartId);

  if (cartItems.length === 0) {
    throw new NotFoundError('Cart is empty');
  }

  // Validate stock and availability of items
  for (const cartItem of cartItems) {
    const item = (cartItem as any).item as Item;
    if (!item) throw new NotFoundError(`Item not found`);
    if (!item.isAvailable) throw new ValidationError(`${item.itemName} is no longer available`);
    if (item.stockQuantity < cartItem.quantity) {
      throw new ValidationError(`Insufficient stock for ${item.itemName}. Available: ${item.stockQuantity}`);
    }
  }

  // calculate total
    const totalAmount = cartItems.reduce((sum, cartItem) => {
        const item = (cartItem as any).item as Item;
        return sum + item.price * cartItem.quantity;
    }, 0);

  // transaction
  const transaction = await sequelize.transaction();

  try {
    // a. create order
        const order = await orderRepository.create(
            { userId, totalAmount } as CreateOrderDto,
            transaction
        );

        // b. create order items + deduct stock
        for (const cartItem of cartItems) {
            const item = (cartItem as any).item as Item;

            await orderItemRepository.create({
                orderId: order.orderId,
                itemId: cartItem.itemId,
                quantity: cartItem.quantity,
                unitPrice: item.price,
                subtotal: item.price * cartItem.quantity,
            }, transaction);

            // deduct stock
            await item.update(
                { stockQuantity: item.stockQuantity - cartItem.quantity },
                { transaction }
            );
        }

        // c. create payment record
        await paymentRepository.create({
            orderId: order.orderId,
            userId,
            amount: totalAmount,
            paymentMethod: paymentMethod as any,
            paymentStatus: 'PENDING',
        }, transaction);

        // d. clear cart items
        await CartItem.destroy({ where: { cartId: cart.cartId }, transaction });

        // commit transaction
        await transaction.commit();

        // 6. create razorpay order (outside transaction — external API call)
        const razorpayOrder = await razorpay.orders.create({
            amount: Math.round(totalAmount * 100), // paise
            currency: 'INR',
            receipt: order.orderId,
            notes: { orderId: order.orderId, userId },
        });

        return {
            order: toOrderDto(order),
            razorpayOrderId: razorpayOrder.id,
            amount: Number(razorpayOrder.amount),
            currency: razorpayOrder.currency,
            keyId: process.env.RAZORPAY_KEY_ID,
        };

  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

// standard CRUD operations

/**
 * Create a new order
 */
const createOrder = async (data: CreateOrderDto): Promise<OrderDto> => {
  const newOrder = await orderRepository.create(data);
  return toOrderDto(newOrder);
};

/**
 * Get all orders 
 */
const getAllOrders = async (options: PaginationOptions): Promise<PaginatedResult<OrderDto>> => {
  const orders = await orderRepository.findAll(options);
  return {
    ...orders,
    data: orders.data.map(toOrderDto)
  };
};

/**
 * Get order by ID
 */
const getOrderById = async (id: string): Promise<OrderDto> => {
  const order = await orderRepository.findById(id);

  if (!order) {
    throw new NotFoundError('Order not found');
  }

  return toOrderDto(order);
};

/**
 * Get orders by user ID
 */
const getOrdersByUserId = async (userId: string): Promise<OrderDto[]> => {
  const orders = await orderRepository.findAllByUserId(userId);
  return orders.map(toOrderDto);
};

/**
 * Update order
 */
const updateOrder = async (id: string, data: UpdateOrderDto): Promise<OrderDto> => {
  const order = await orderRepository.update(id, data);

  if (!order) {
    throw new NotFoundError('Order not found');
  }

  return toOrderDto(order);
};

const updateOrderStatus = async (id: string, status: string): Promise<OrderDto> => {
  const order = await orderRepository.updateStatus(id, status);

  if (!order) {
    throw new NotFoundError('Order not found');
  }

  return toOrderDto(order);
}

/**
 * Delete order
 */
const deleteOrder = async (id: string): Promise<{ message: string }> => {
  const order = await orderRepository.findById(id);

  if (!order) {
    throw new NotFoundError('Order not found');
  }

  await orderRepository.delete(id);

  return { message: 'Order deleted successfully' };
};

export default {
  checkout,
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersByUserId,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
};
