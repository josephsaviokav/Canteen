import {z} from 'zod';

const cartIdSchema = z.uuid();

const userIdSchema = z.uuid();

export const createCartSchema = z.object({
    userId: userIdSchema,
});

export const getCartByIdSchema = z.object({
    cartId: cartIdSchema
});

export const cartSchema = z.object({
    cartId: cartIdSchema,
    userId: userIdSchema
});

export type CreateCartDto = z.infer<typeof createCartSchema>;
export type CartByIdDto = z.infer<typeof getCartByIdSchema>;
export type CartDto = z.infer<typeof cartSchema>;