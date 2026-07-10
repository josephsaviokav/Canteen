import { Transaction } from "sequelize";
import { CreateCartItemDTO, UpdateCartItemDTO } from "./cartItem.dto.js";
import CartItem from "./cartItem.entity.js";
import { Order as Order_ } from "sequelize";
import { PaginatedResult, PaginationOptions } from "../../utils/pagination.js";
import Item from "../item/item.entity.js";

class CartItemRepository {
    async create(data: CreateCartItemDTO, transaction?: Transaction): Promise<CartItem> {
        return await CartItem.create(data, { transaction });
    }

    async findAllByCartId(cartId: string): Promise<CartItem[]> {
        return await CartItem.findAll({ where: { cartId } });
    }

    async findAllByCartIdWithItems(cartId: string): Promise<CartItem[]> {
        return await CartItem.findAll({
            where: { cartId },
            include: [{ model: Item, as: 'item' }],
        });
    }

    async findByCartIdAndItemId(cartId: string, itemId: string): Promise<CartItem | null> {
        return await CartItem.findOne({ where: { cartId, itemId } });
    }

    async findById(cartItemId: string): Promise<CartItem | null> {
        return await CartItem.findByPk(cartItemId);
    }

    async findAll(options: PaginationOptions): Promise<PaginatedResult<CartItem>> {
        const {
            page = 1,
            limit = 10,
            sortBy = 'createdAt',
            sortOrder = 'ASC'
        } = options;

        const offset = (page - 1) * limit;
        const order: Order_ = [[sortBy, sortOrder]];

        const { rows, count } = await CartItem.findAndCountAll({
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

    async update(cartItemId: string, data: UpdateCartItemDTO, transaction?: Transaction): Promise<CartItem | null> {
        const cartItem = await this.findById(cartItemId);
        if (!cartItem) {
            return null;
        }
        return await cartItem.update(data, { transaction });
    }

    async delete(cartItemId: string, transaction?: Transaction): Promise<boolean> {
        const deleted = await CartItem.destroy({ where: { cartItemId }, transaction });
        return deleted > 0;
    }
}

export default new CartItemRepository();