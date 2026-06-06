import { ValidationError } from "./errors";

export const validate = <T>(schema: { safeParse: (value: unknown) => { success: boolean; data?: T; error?: { issues: Array<{ message: string }> } } }, value: unknown): T => {
    const result = schema.safeParse(value);
    if (!result.success) {
        const message = result.error?.issues.map((issue) => issue.message).join(', ') || 'Validation failed';
        throw new ValidationError(message);
    }

    return result.data as T;
};