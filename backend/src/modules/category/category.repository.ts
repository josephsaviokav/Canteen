import { Transaction } from "sequelize";
import { CreateCategoryDTO, UpdateCategoryDTO } from "./category.dto";
import Category from "./category.entity";

class CategoryRepository {
    async create(data: CreateCategoryDTO,transaction?: Transaction): Promise<Category> {
        return await Category.create(data, { transaction });
    }

    async findAll(): Promise<Category[]> {
        return await Category.findAll();
    }

    async findById(id: string): Promise<Category | null> {
        return await Category.findByPk(id);
    }

    async update(id: string, data: UpdateCategoryDTO, transaction?: Transaction): Promise<Category | null> {
        const category = await this.findById(id);
        if (!category) {
            return null;
        }

        return await category.update(data, { transaction });
    }

    async delete(id: string, transaction?: Transaction): Promise<boolean> {
        const deleted = await Category.destroy({ where: { categoryId: id }, transaction });
        return deleted > 0;
    }
}

export default new CategoryRepository();