import type { NextFunction, Request, Response } from 'express';

/**
 * Request logging middleware
 *
 * Logs incoming HTTP requests with method, path, status code, and response time.
 * Useful for debugging, monitoring, and audit trails.
 */
export const requestLogger = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const startTime = Date.now();
    const originalSend = res.send;

    // Override send to capture response details
    res.send = function (data) {
        const duration = Date.now() - startTime;
        const logLevel =
            res.statusCode >= 500
                ? 'error'
                : res.statusCode >= 400
                  ? 'warn'
                  : 'info';

        const logData = {
            timestamp: new Date().toISOString(),
            method: req.method,
            path: req.originalUrl,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip || req.socket.remoteAddress,
            userAgent: req.get('user-agent'),
        };

        if (logLevel === 'error') {
            console.error('HTTP Request:', logData);
        } else if (logLevel === 'warn') {
            console.warn('HTTP Request:', logData);
        } else {
            console.log('HTTP Request:', logData);
        }

        return originalSend.call(this, data);
    };

    next();
};
