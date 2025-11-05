import Payment from '../models/payment.js';
import Order from '../models/order.js';

const createPayment = async (data: {
    orderId: string;
    amount: number;
    paymentMethod: 'cash' | 'card' | 'upi';
    transactionId?: string;
}) => {
    if (!data.orderId || !data.amount || !data.paymentMethod) {
        throw new Error('Order ID, amount, and payment method are required');
    }

    // Verify order exists
    const order = await Order.findByPk(data.orderId);
    if (!order) {
        throw new Error('Order not found');
    }

    // Create payment
    const payment = await Payment.create({
        orderId: data.orderId,
        amount: data.amount,
        paymentMethod: data.paymentMethod,
        status: 'pending',
        ...(data.transactionId !== undefined && { transactionId: data.transactionId }),
    });

    return payment;
};

// Get all payments
const getAllPayments = async () => {
    return await Payment.findAll({
        order: [['createdAt', 'DESC']],
    });
};

// Get payment by ID
const getPaymentById = async (id: string) => {
    const payment = await Payment.findByPk(id);
    if (!payment) {
        throw new Error('Payment not found');
    }
    return payment;
};

// Get payment by order ID
const getPaymentByOrderId = async (orderId: string) => {
    const payment = await Payment.findOne({
        where: { orderId },
    });
    if (!payment) {
        throw new Error('Payment not found for this order');
    }
    return payment;
};

// Update payment status
const updatePaymentStatus = async (
    id: string,
    data: {
        status?: 'pending' | 'completed' | 'cancelled';
        transactionId?: string;
    }
) => {
    const payment = await Payment.findByPk(id);
    if (!payment) {
        throw new Error('Payment not found');
    }

    if (data.status !== undefined) {
        payment.status = data.status;
    }
    if (data.transactionId !== undefined) {
        payment.transactionId = data.transactionId;
    }

    await payment.save();

    // Update order status if payment is completed
    if (data.status === 'completed') {
        const order = await Order.findByPk(payment.orderId);
        if (order) {
            order.status = 'completed';
            await order.save();
        }
    }

    return payment;
};

// Delete payment
const deletePayment = async (id: string) => {
    const payment = await Payment.findByPk(id);
    if (!payment) {
        throw new Error('Payment not found');
    }

    await payment.destroy();
    return { message: 'Payment deleted successfully' };
};

export default {
    createPayment,
        getAllPayments,
        getPaymentById,
        getPaymentByOrderId,
        updatePaymentStatus,
        deletePayment,
  };