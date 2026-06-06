import { PaginatedResult, PaginationOptions } from "../../utils/pagination";
import { CreateCartDto } from "./cart.dto";
import Cart from "./cart.entity";
import { Order as Order_, Transaction } from "sequelize";

class CartRepository {
    async create(data: CreateCartDto, transaction?: Transaction): Promise<Cart | null> {
        const existingCart = await Cart.findOne({ where: { userId: data.userId } });
        if (existingCart) {
            return null;
        }
        return await Cart.create(data, { transaction });
    }

    async findByUserId(userId: string): Promise<Cart | null> {
        return await Cart.findOne({ where: { userId } });
    }

    async findAll(options: PaginationOptions): Promise<PaginatedResult<Cart>> {
        const {
            page = 1,
            limit = 10,
            sortBy = 'createdAt',
            sortOrder = 'ASC'
        } = options;

        const offset = (page - 1) * limit;
        const order: Order_ = [[sortBy, sortOrder]];

        const { rows, count } = await Cart.findAndCountAll({
            limit,
            offset,
            order,
        });

        return {
            data: rows,
            total: count,
            page,
            limit,
            totalPages: Math.ceil(count / limit),
        };
    }
}

export default new CartRepository();