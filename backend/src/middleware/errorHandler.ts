import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors.js';

/**
 * Global error handler middleware
 * 
 * Catches all errors passed via next(error) and sends consistent JSON responses
 * 
 * Usage in app.ts (MUST be last middleware):
 * app.use(errorHandler);
 */
const errorHandler = (
    error: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Default error values
    let statusCode = 500;
    let message = 'Internal server error';
    let isOperational = false;

    // Check if it's our custom AppError
    if (error instanceof AppError) {
        statusCode = error.statusCode;
        message = error.message;
        isOperational = error.isOperational;
    } else {
        // Generic errors (like TypeError, etc.)
        message = error.message || 'Something went wrong';
    }

    // Log error for debugging (in production, use proper logger)
    console.error('Error:', {
        message: error.message,
        statusCode,
        stack: error.stack,
        path: req.path,
        method: req.method,
        timestamp: new Date().toISOString()
    });

    // Send error response
    res.status(statusCode).json({
        success: false,
        message: message,
        ...(process.env.NODE_ENV === 'development' && {
            // Only show stack trace in development
            stack: error.stack,
            error: error
        })
    });
};

export default errorHandler;
