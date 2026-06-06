import { z } from "zod";

const categoryIdSchema = z.uuid("Invalid category ID format");

const categoryNameSchema = z.string()
    .trim()
    .min(1, "Category name is required")
    .max(255, "Category name must not exceed 255 characters");  

const categoryDescriptionSchema = z.string()
    .trim()
    .max(1000, "Category description must not exceed 1000 characters");

export const createCategorySchema = z.object({
    categoryName: categoryNameSchema,
    categoryDescription: categoryDescriptionSchema,
});

export const updateCategorySchema = z.object({
    categoryName: categoryNameSchema.optional(),
    categoryDescription: categoryDescriptionSchema.optional(),
}).refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
});

export const categorySchema = z.object({
    categoryId: categoryIdSchema,
    categoryName: categoryNameSchema,
    categoryDescription: categoryDescriptionSchema,
});

export type CreateCategoryDTO = z.infer<typeof createCategorySchema>;
export type UpdateCategoryDTO = z.infer<typeof updateCategorySchema>;
export type CategoryDTO = z.infer<typeof categorySchema>;