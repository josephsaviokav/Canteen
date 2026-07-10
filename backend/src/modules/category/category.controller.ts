import type { Request, Response } from 'express';
import { asyncHandler } from '../../middleware/errorHandler.js';
import { ValidationError } from '../../utils/errors.js';
import { validate } from '../../utils/validate.js';
import { createCategorySchema } from './category.dto.js';
import categoryService from './category.service.js';

// create category
const createCategory = asyncHandler(async (req: Request, res: Response) => {
    const payload = validate(createCategorySchema, req.body);
    const category = await categoryService.createCategory(payload);

    res.status(201).json({
        success: true,
        message: 'Category created successfully',
        data: category,
    });
});

// get all categories
const getAllCategories = asyncHandler(async (req: Request, res: Response) => {
    const categories = await categoryService.getAllCategories();

    res.status(200).json({
        success: true,
        message: 'Categories retrieved successfully',
        data: categories,
    });
});

// get category by ID
const getCategoryById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
        throw new ValidationError('Category ID is required');
    }

    const category = await categoryService.getCategoryById(id as string);

    res.status(200).json({
        success: true,
        message: 'Category retrieved successfully',
        data: category,
    });
});

// update category
const updateCategory = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
        throw new ValidationError('Category ID is required');
    }

    const payload = validate(createCategorySchema, req.body);
    const category = await categoryService.updateCategory(id as string, payload);

    res.status(200).json({
        success: true,
        message: 'Category updated successfully',
        data: category,
    });
});

// delete category
const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
        throw new ValidationError('Category ID is required');
    }

    const result = await categoryService.deleteCategory(id as string);

    res.status(200).json({
        success: true,
        message: result.message,
    });
});

export default {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};
