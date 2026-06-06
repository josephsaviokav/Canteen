import { it } from 'node:test';
import {z} from 'zod';

const cartItemIdSchema = z.uuid();
const cartIdSchema = z.uuid();
const itemIdSchema = z.uuid();
const quantitySchema = z.number().int().positive();

export const createCartItemSchema = z.object({
    cartId: cartIdSchema,
    itemId: itemIdSchema,
    quantity: quantitySchema,
});

export const updateCartItemSchema = z.object({
    cartId: cartIdSchema.optional(),
    itemId: itemIdSchema.optional(),
    quantity: quantitySchema.optional(),
});

const cartItemSchema = z.object({
    cartItemId: cartItemIdSchema,
    cartId: cartIdSchema,
    itemId: itemIdSchema,
    quantity: quantitySchema,
});

export const getCartItemByCartIdSchema = z.object({
    cartItemId: cartItemIdSchema,
    itemId: itemIdSchema,
    quantity: quantitySchema,
});

export type CreateCartItemDTO = z.infer<typeof createCartItemSchema>;
export type UpdateCartItemDTO = z.infer<typeof updateCartItemSchema>;
export type CartItemDTO = z.infer<typeof cartItemSchema>;
export type CartItemByCartIdDTO = z.infer<typeof getCartItemByCartIdSchema>;