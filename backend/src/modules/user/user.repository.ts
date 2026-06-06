import { Op, Transaction, WhereOptions, Order } from "sequelize";
import User from "./user.entity";
import { CreateUserDTO, UpdateUserDTO } from "./user.dto";
import { PaginationOptions, PaginatedResult } from "../../utils/pagination";

// Repository

class UserRepository {
    async create(data: CreateUserDTO, transaction?: Transaction): Promise<User> {
        return await User.create(data as any, { transaction });
    }

    async findById(userId: string, transaction?: Transaction): Promise<User | null> {
        return await User.findOne({ where: { userId }, transaction });
    }

    async findByEmail(email: string, transaction?: Transaction): Promise<User | null> {
        return await User.findOne({ where: { email }, transaction });
    }

    async findAll(options: PaginationOptions = {}): Promise<PaginatedResult<User>> {
        const {
            page = 1,
            limit = 10,
            sortBy = "userId",
            sortOrder = "ASC",
        } = options;

        const offset = (page - 1) * limit;
        const order: Order = [[sortBy as string, sortOrder]];

        const { count, rows } = await User.findAndCountAll({
            limit,
            offset,
            order,
            attributes: { exclude: ["password"] },
        });

        return {
            data: rows,
            total: count,
            page,
            limit,
            totalPages: Math.ceil(count / limit),
        };
    }

    async findAllByRole(role: string, options: PaginationOptions = {}): Promise<PaginatedResult<User>> {
        const {
            page = 1,
            limit = 10,
            sortBy = "userId",
            sortOrder = "ASC",
        } = options;

        const offset = (page - 1) * limit;
        const order: Order = [[sortBy as string, sortOrder]];

        const { count, rows } = await User.findAndCountAll({
            where: { role },
            limit,
            offset,
            order,
            attributes: { exclude: ["password"] },
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
        userId: string,
        data: UpdateUserDTO,
        transaction?: Transaction
    ): Promise<User | null> {
        const user = await User.findOne({ where: { userId }, transaction });
        if (!user) return null;
        return await user.update(data as any, { transaction });
    }

    async updatePassword(
        userId: string,
        newPassword: string,
        transaction?: Transaction
    ): Promise<User | null> {
        const user = await User.findOne({ where: { userId }, transaction });
        if (!user) return null;
        return await user.update({ password: newPassword } as any, { transaction });
    }

    async delete(userId: string, transaction?: Transaction): Promise<boolean> {
        const deleted = await User.destroy({ where: { userId }, transaction });
        return deleted > 0;
    }

    async existsByEmail(email: string, excludeUserId?: string): Promise<boolean> {
        const where: WhereOptions = excludeUserId
            ? { email, userId: { [Op.ne]: excludeUserId } }
            : { email };
        const count = await User.count({ where });
        return count > 0;
    }

}

export default new UserRepository(); 