import type { NextFunction, Request, RequestHandler, Response } from 'express';
import {
    ForeignKeyConstraintError,
    UniqueConstraintError,
    ValidationError as SequelizeValidationError,
} from 'sequelize';
import { AppError, NotFoundError } from '../utils/errors.js';

type AsyncHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<unknown>;

// Wrapper to catch errors in async route handlers and pass them to the global error handler
export const asyncHandler = (handler: AsyncHandler): RequestHandler => {
    return (req, res, next) => {
        Promise.resolve(handler(req, res, next)).catch(next);
    };
};

// Middleware to handle 404 Not Found errors for undefined routes
export const notFoundHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    next(new NotFoundError(`Route not found: ${req.method} ${req.originalUrl}`));
};

/**
 * Global error handler middleware
 *
 * Catches all errors passed via next(error) and sends consistent JSON responses.
 */
const errorHandler = (
    error: unknown,
    req: Request,       
    res: Response,
    next: NextFunction
) => {
    let statusCode = 500;
    let message = 'Internal server error';
    let details: unknown;

    if (error instanceof AppError) {
        statusCode = error.statusCode;
        message = error.message;
    } else if (error instanceof SequelizeValidationError) {
        statusCode = 400;
        message = 'Validation failed';
        details = error.errors.map((item) => ({
            message: item.message,
            path: item.path,
            value: item.value,
        }));
    } else if (error instanceof UniqueConstraintError) {
        statusCode = 409;
        message = 'Resource already exists';
        details = error.errors.map((item) => ({
            message: item.message,
            path: item.path,
            value: item.value,
        }));
    } else if (error instanceof ForeignKeyConstraintError) {
        statusCode = 400;
        message = 'Invalid reference to related resource';
    } else if (error instanceof SyntaxError && 'body' in error) {
        statusCode = 400;
        message = 'Invalid JSON payload';
    } else if (error instanceof Error) {
        message = error.message || message;
    }

    const logPayload = {
        message,
        statusCode,
        path: req.originalUrl,
        method: req.method,
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString(),
    };

    if (statusCode >= 500) {
        console.error('Unhandled error:', logPayload);
    } else {
        console.warn('Request error:', logPayload);
    }

    const response: Record<string, unknown> = {
        success: false,
        message,
    };

    if (details) {
        response.details = details;
    }

    if (process.env.NODE_ENV === 'development' && error instanceof Error) {
        response.stack = error.stack;
        response.error = {
            name: error.name,
            message: error.message,
        };
    }

    res.status(statusCode).json(response);
};

export default errorHandler;
