import type { Request, Response, NextFunction } from 'express';
import { TooManyRequestsError } from '../utils/errors';

interface RateLimitConfig {
    windowMs: number; // Time window in milliseconds
    maxRequests: number; // Max requests per window
}

interface ClientRecord {
    count: number;
    resetTime: number;
}

/**
 * Simple in-memory rate limiter middleware
 *
 * Limits requests per IP address within a time window.
 * For production, use external services (Redis) instead.
 */
export const createRateLimiter = (config: RateLimitConfig) => {
    const store = new Map<string, ClientRecord>();

    setInterval(() => {
        const now = Date.now();
        for (const [key, record] of store.entries()) {
            if (record.resetTime < now) {
                store.delete(key);
            }
        }
    }, config.windowMs);

    return (_req: Request, res: Response, next: NextFunction) => {
        const clientIp = _req.ip || _req.socket.remoteAddress || 'unknown';
        const now = Date.now();

        let record = store.get(clientIp);

        if (!record || record.resetTime < now) {
            record = {
                count: 1,
                resetTime: now + config.windowMs,
            };
            store.set(clientIp, record);
            next();
        } else if (record.count < config.maxRequests) {
            record.count += 1;
            next();
        } else {
            const retryAfter = Math.ceil(
                (record.resetTime - now) / 1000
            );
            res.set('Retry-After', retryAfter.toString());
            next(
                new TooManyRequestsError(
                    `Rate limit exceeded. Try again in ${retryAfter} seconds.`
                )
            );
        }
    };
};

/**
 * Default global rate limiter: 100 requests per 15 minutes
 */
export const globalRateLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
});

/**
 * Strict rate limiter for auth endpoints: 5 requests per 15 minutes
 */
export const authRateLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
});
