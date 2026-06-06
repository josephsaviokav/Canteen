import sequelize from "../../config/database";
import { Transaction } from "sequelize";
import { CreatePaymentDto, UpdatePaymentDto } from "./payment.dto";
import Payment from "./payment.entity";
import { PaginationOptions, PaginatedResult } from "../../utils/pagination";

export interface PaymentStats {
    totalPayments: number;
    completedPayments: number;
    pendingPayments: number;
    failedPayments: number;
    totalAmount: number;
    completedAmount: number;
}

class PaymentRepository {

    async create(data: CreatePaymentDto, transaction?: Transaction): Promise<Payment> {
        return await Payment.create(data as any, { transaction });
    }

    async findById(paymentId: string, transaction?: Transaction): Promise<Payment | null> {
        return await Payment.findOne({ where: { paymentId }, transaction });
    }

    async findByOrderId(orderId: string, transaction?: Transaction): Promise<Payment | null> {
        return await Payment.findOne({ where: { orderId }, transaction });
    }

    async findAllByUserId(userId: string, transaction?: Transaction): Promise<Payment[]> {
        return await Payment.findAll({ where: { userId }, transaction });
    }

    async findAllByStatus(paymentStatus: string, transaction?: Transaction): Promise<Payment[]> {
        return await Payment.findAll({ where: { paymentStatus }, transaction });
    }

    async findAll(options: PaginationOptions = {}): Promise<PaginatedResult<Payment>> {
        const { page = 1, limit = 10, sortBy = "createdAt", sortOrder = "DESC" } = options;
        const offset = (page - 1) * limit;

        const { count, rows } = await Payment.findAndCountAll({
            limit,
            offset,
            order: [[sortBy as string, sortOrder]],
        });

        return {
            data: rows,
            total: count,
            page,
            limit,
            totalPages: Math.ceil(count / limit),
        };
    }

    async update(
        paymentId: string,
        data: UpdatePaymentDto,
        transaction?: Transaction
    ): Promise<Payment | null> {
        const payment = await Payment.findOne({ where: { paymentId }, transaction });
        if (!payment) return null;
        return await payment.update(data as any, { transaction });
    }

    async delete(paymentId: string, transaction?: Transaction): Promise<boolean> {
        const deleted = await Payment.destroy({ where: { paymentId }, transaction });
        return deleted > 0;
    }

    async getStats(): Promise<PaymentStats> {
        const rows = await Payment.findAll({
            attributes: [
                "paymentStatus",
                [sequelize.fn("COUNT", sequelize.col("payment_id")), "count"],
                [sequelize.fn("SUM", sequelize.col("amount")), "total"],
            ],
            group: ["paymentStatus"],
            raw: true,
        }) as any[];

        const statsMap = { COMPLETED: { count: 0, total: 0 }, PENDING: { count: 0, total: 0 }, FAILED: { count: 0, total: 0 } };

        for (const row of rows) {
            const status = row.paymentStatus as keyof typeof statsMap;
            if (status in statsMap) {
                statsMap[status] = { count: Number(row.count), total: Number(row.total) };
            }
        }

        return {
            totalPayments: statsMap.COMPLETED.count + statsMap.PENDING.count + statsMap.FAILED.count,
            completedPayments: statsMap.COMPLETED.count,
            pendingPayments: statsMap.PENDING.count,
            failedPayments: statsMap.FAILED.count,
            totalAmount: statsMap.COMPLETED.total + statsMap.PENDING.total + statsMap.FAILED.total,
            completedAmount: statsMap.COMPLETED.total,
        };
    }
}

export default new PaymentRepository();