import { NotFoundError } from "../../utils/errors";
import { CategoryDTO, CreateCategoryDTO, UpdateCategoryDTO } from "./category.dto";
import Category from "./category.entity";
import CategoryRepository from "./category.repository";

const toCategoryDTO = (category: Category): CategoryDTO => {
    return category.toJSON() as CategoryDTO;
}

// create category
const createCategory = async (data: CreateCategoryDTO): Promise<CategoryDTO> => {
    const newCategory = await CategoryRepository.create(data);
    return toCategoryDTO(newCategory);
}

// get all categories
const getAllCategories = async (): Promise<CategoryDTO[]> => {
    const categories = await CategoryRepository.findAll();
    return categories.map(category => toCategoryDTO(category));
}

// get category by ID
const getCategoryById = async (id: string): Promise<CategoryDTO> => {
    const category = await CategoryRepository.findById(id);

    if (!category) {
        throw new NotFoundError('Category not found');
    }
    return toCategoryDTO(category);
}

// update category
const updateCategory = async (id: string, data: UpdateCategoryDTO): Promise<CategoryDTO> => {
    const updatedCategory = await CategoryRepository.update(id, data);
    if (!updatedCategory) {
        throw new NotFoundError('Category not found');
    }
    return toCategoryDTO(updatedCategory);
}

// delete category
const deleteCategory = async (id: string): Promise<{message : string}> => {
    const deleted = await CategoryRepository.delete(id);

    if (!deleted) {
        throw new NotFoundError('Category not found');
    }

    return { message: 'Category deleted successfully' };
}

export default {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
}