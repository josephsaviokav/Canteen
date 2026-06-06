import { z } from 'zod';

export const paymentMethodEnum = z.enum(['CREDIT_CARD', 'UPI', 'NET_BANKING']);
export const paymentStatusEnum = z.enum(['PENDING', 'COMPLETED', 'FAILED']);

const paymentIdSchema = z.uuid('Invalid payment ID format');
const orderIdSchema = z.uuid('Invalid order ID format');
const userIdSchema = z.uuid('Invalid user ID format');
const amountSchema = z.number().min(0, 'Amount must be a positive number');

export const createPaymentSchema = z.object({
  orderId: orderIdSchema,
  userId: userIdSchema,
  paymentMethod: paymentMethodEnum,
  amount: amountSchema,
  paymentStatus: paymentStatusEnum.optional().default('PENDING'),
});

export const updatePaymentSchema = z.object({
  paymentMethod: paymentMethodEnum.optional(),
  amount: amountSchema.optional(),
  paymentStatus: paymentStatusEnum.optional(),
});

export const paymentSchema = z.object({
  paymentId: paymentIdSchema,
  orderId: orderIdSchema,
  userId: userIdSchema,
  paymentMethod: paymentMethodEnum,
  amount: amountSchema,
  paymentStatus: paymentStatusEnum,
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export type CreatePaymentDto = z.infer<typeof createPaymentSchema>;
export type UpdatePaymentDto = z.infer<typeof updatePaymentSchema>;
export type PaymentDto = z.infer<typeof paymentSchema>;
export type PaymentStatusEnum = z.infer<typeof paymentStatusEnum>;

// export const paymentMethods = ['CREDIT_CARD', 'UPI', 'NET_BANKING'] as const;
// export const paymentStatuses = ['PENDING', 'COMPLETED', 'FAILED'] as const;
