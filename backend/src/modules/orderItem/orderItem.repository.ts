import { CreateOrderItemDto, UpdateOrderItemDto } from "./orderItem.dto";
import OrderItem from "./orderItem.entity";
import { Order as Order_, Transaction } from "sequelize";
import { PaginationOptions, PaginatedResult } from "../../utils/pagination";

class OrderItemRepository {
    async create(data: CreateOrderItemDto, transaction?: Transaction): Promise<OrderItem> {
        const orderItem = await OrderItem.create(data, { transaction });
        return orderItem;
    }

    async findAll(options: PaginationOptions = {}): Promise<PaginatedResult<OrderItem>> {
        const { 
            page = 1,
            limit = 10, 
            sortBy = "orderItemId", 
            sortOrder = "ASC"
         } = options;

        const offset = (page - 1) * limit;
        const order: Order_ = [[sortBy as string, sortOrder]];

        const { count, rows } = await OrderItem.findAndCountAll({
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

    async findById(id: string): Promise<OrderItem | null> {
        return await OrderItem.findByPk(id);
    }

    async findAllByOrderId(orderId: string): Promise<OrderItem[]> {
        return await OrderItem.findAll({ where: { orderId } });
    }

    async findAllByItemId(itemId: string): Promise<OrderItem[]> {
        return await OrderItem.findAll({ where: { itemId } });
    }

    async update(orderItemId: string, data: UpdateOrderItemDto, transaction?: Transaction): Promise<OrderItem | null> {
        const orderItem = await OrderItem.findByPk(orderItemId);
        if (!orderItem) {
            return null;
        }
        return await orderItem.update(data, { transaction });
    }

    async delete(orderItemId: string, transaction?: Transaction): Promise<boolean> {
        const deleted = await OrderItem.destroy({ where: { orderItemId }, transaction });
        return deleted > 0;
    }

    async deleteByOrderId(orderId: string, transaction?: Transaction): Promise<boolean> {
        const deleted = await OrderItem.destroy({ where: { orderId }, transaction });
        return deleted > 0;
    }

}
export default new OrderItemRepository();