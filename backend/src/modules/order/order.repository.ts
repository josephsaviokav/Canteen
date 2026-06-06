import { CreateOrderDto, UpdateOrderDto } from "./order.dto";
import Order from "./order.entity";
import { Order as Order_, Transaction } from "sequelize";
import { PaginationOptions, PaginatedResult } from "../../utils/pagination";

class OrderRepository {
    async create(data: CreateOrderDto, transaction?: Transaction): Promise<Order> {
        return await Order.create({
            ...data,
            placedAt: new Date(),
        }, { transaction });
    }

    async findAll(options: PaginationOptions = {}): Promise<PaginatedResult<Order>> {
        const { 
            page = 1,
            limit = 10, 
            sortBy = "orderId", 
            sortOrder = "ASC"
         } = options;

        const offset = (page - 1) * limit;
        const order: Order_ = [[sortBy as string, sortOrder]];

        const { count, rows } = await Order.findAndCountAll({
            limit,
            offset,
            order,
        });

        return {
            data: rows,
            total: count,
            page,
            limit,
            totalPages: Math.ceil(count / limit)
        };
    }

    async findById(id: string): Promise<Order | null> {
        return await Order.findByPk(id);
    }

    async findAllByUserId(userId: string): Promise<Order[]> {
        return await Order.findAll({ where: { userId } });
    }

    async update(orderId: string, data: UpdateOrderDto, transaction?: Transaction): Promise<Order | null> {
        const order = await this.findById(orderId);
        if (!order) {
            return null;
        }
        return await order.update(data, { transaction });
    }

    async updateStatus(orderId: string, status: string, transaction?: Transaction): Promise<Order | null> {
        const order = await this.findById(orderId);
        if (!order) {
            return null;
        }

        return await order.update({ status } as any, { transaction });
    }

    async delete(orderId: string, transaction?: Transaction): Promise<boolean> {
        const deleted = await Order.destroy({ where: { orderId }, transaction });
        return deleted > 0;
    }
}

export default new OrderRepository();