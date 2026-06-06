import { CreateItemDto, UpdateItemDto } from "./item.dto";
import Item from "./item.entity";
import { Order as Order_, Transaction } from "sequelize";
import { PaginationOptions, PaginatedResult } from "../../utils/pagination";

class ItemRepository {
    async create(data: CreateItemDto, transaction?: Transaction): Promise<Item> {
        return await Item.create(data, { transaction });
    }

    async findAll(options: PaginationOptions): Promise<PaginatedResult<Item>> {
        const { 
            page = 1, 
            limit = 10, 
            sortBy = 'itemId', 
            sortOrder = 'ASC'
        } = options;

        const offset = (page - 1) * limit;
        const order: Order_ = [[sortBy as string, sortOrder]];

        const { rows, count } = await Item.findAndCountAll({
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

    async findById(id: string): Promise<Item | null> {
        return await Item.findByPk(id);
    }

    async update(id: string, data: UpdateItemDto, transaction?: Transaction): Promise<Item | null> {
        const item = await this.findById(id);
        if (!item) {
            return null;
        }
        return await item.update(data, { transaction });
    }

    async delete(itemId: string, transaction?: Transaction): Promise<boolean> {
        const deleted = await Item.destroy({ where: { itemId }, transaction });
        return deleted > 0;
    }
}

export default new ItemRepository();