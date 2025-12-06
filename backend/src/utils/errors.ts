/**
 * Base class for custom errors
 */
export class AppError extends Error {
    statusCode: number;
    isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;

        // Maintains proper stack trace
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * 404 Not Found Error
 */
export class NotFoundError extends AppError {
    constructor(message: string = 'Resource not found') {
        super(message, 404);
    }
}

/**
 * 400 Bad Request / Validation Error
 */
export class ValidationError extends AppError {
    constructor(message: string = 'Validation failed') {
        super(message, 400);
    }
}

/**
 * 401 Unauthorized Error
 */
export class UnauthorizedError extends AppError {
    constructor(message: string = 'Unauthorized') {
        super(message, 401);
    }
}

/**
 * 403 Forbidden Error
 */
export class ForbiddenError extends AppError {
    constructor(message: string = 'Forbidden') {
        super(message, 403);
    }
}

/**
 * 409 Conflict Error (e.g., duplicate email)
 */
export class ConflictError extends AppError {
    constructor(message: string = 'Resource already exists') {
        super(message, 409);
    }
}
