import { z } from 'zod';

const orderItemIdSchema = z.uuid('Invalid order item ID format');
const orderIdSchema = z.uuid('Invalid order ID format');
const itemIdSchema = z.uuid('Invalid item ID format');
const quantitySchema = z.number().int().min(1, 'Quantity must be at least 1');
const priceSchema = z.number().min(0, 'Price must be a positive number');

export const createOrderItemSchema = z.object({
  orderId: orderIdSchema,
  itemId: itemIdSchema,
  quantity: quantitySchema,
  unitPrice: priceSchema,
  subtotal: priceSchema,
});

export const updateOrderItemSchema = z.object({
  quantity: quantitySchema.optional(),
  unitPrice: priceSchema.optional(),
  subtotal: priceSchema.optional(),
});

export const orderItemSchema = z.object({
  orderItemId: orderItemIdSchema,
  orderId: orderIdSchema,
  itemId: itemIdSchema,
  quantity: quantitySchema,
  unitPrice: priceSchema,
  subtotal: priceSchema,
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export type CreateOrderItemDto = z.infer<typeof createOrderItemSchema>;
export type UpdateOrderItemDto = z.infer<typeof updateOrderItemSchema>;
export type OrderItemDto = z.infer<typeof orderItemSchema>;
