import OrderItem from './orderItem.entity';
import { NotFoundError } from '../../utils/errors';
import type { CreateOrderItemDto, UpdateOrderItemDto, OrderItemDto } from './orderItem.dto';
import orderItemRepository from './orderItem.repository';
import type { PaginationOptions, PaginatedResult } from '../../utils/pagination';

const toOrderItemDto = (orderItem: OrderItem): OrderItemDto => orderItem.toJSON() as OrderItemDto;

/**
 * Create a new order item
 */
const createOrderItem = async (data: CreateOrderItemDto): Promise<OrderItemDto> => {
  const newOrderItem = await orderItemRepository.create(data);
  return toOrderItemDto(newOrderItem);
};

/**
 * Get all order items - optional filtering by orderId
 */
const getAllOrderItems = async (options: PaginationOptions = {}): Promise<PaginatedResult<OrderItemDto>> => {
  const result = await orderItemRepository.findAll(options);
  return { ...result, data: result.data.map(toOrderItemDto) };
};

/**
 * Get order item by ID
 */
const getOrderItemById = async (id: string): Promise<OrderItemDto> => {
  const orderItem = await orderItemRepository.findById(id);

  if (!orderItem) {
    throw new NotFoundError('Order item not found');
  }

  return toOrderItemDto(orderItem);
};

/**
 * Get order items by order ID
 */
const getOrderItemsByOrderId = async (orderId: string): Promise<OrderItemDto[]> => {
  const orderItems = await orderItemRepository.findAllByOrderId(orderId);
  return orderItems.map(toOrderItemDto);
};

/**
 * Get order items by item ID
 */
const getOrderItemsByItemId = async (itemId: string): Promise<OrderItemDto[]> => {
  const orderItems = await orderItemRepository.findAllByItemId(itemId);
  return orderItems.map(toOrderItemDto);
};

/**
 * Update order item
 */
const updateOrderItem = async (id: string, data: UpdateOrderItemDto): Promise<OrderItemDto> => {
  const updatedOrderItem = await orderItemRepository.update(id, data);
  if (!updatedOrderItem) {
    throw new NotFoundError('Order item not found');
  }
  return toOrderItemDto(updatedOrderItem);
};

/**
 * Delete order item
 */
const deleteOrderItem = async (id: string): Promise<{ message: string }> => {
  const orderItem = await orderItemRepository.findById(id);

  if (!orderItem) {
    throw new NotFoundError('Order item not found');
  }

  await orderItemRepository.delete(id);
  return { message: 'Order item deleted successfully' };
};

/**
 * Delete all order items for an order
 */
const deleteOrderItemsByOrderId = async (orderId: string): Promise<{ message: string }> => {
  await orderItemRepository.deleteByOrderId(orderId);
  return { message: 'Order items deleted successfully'};
};

export default {
  createOrderItem,
  getAllOrderItems,
  getOrderItemById,
  getOrderItemsByOrderId,
  getOrderItemsByItemId,
  updateOrderItem,
  deleteOrderItem,
  deleteOrderItemsByOrderId,
};
