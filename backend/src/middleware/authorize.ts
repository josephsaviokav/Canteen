import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { asyncHandler } from './errorHandler';
import { UnauthorizedError } from '../utils/errors';


//  User payload DTO for authentication token
export interface UserPayloadDTO {
    userId: string;
    email: string;
    role: 'admin' | 'customer';
}

// Extend Express Request type to include user data
declare global {
    namespace Express {
        interface Request {
            user?: UserPayloadDTO;
        }
    }
}

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
}

interface DecodedToken extends UserPayloadDTO {
    iat: number;
    exp: number;
}

// Authentication middleware to protect routes
const auth = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedError('Authorization header missing or malformed. Expected: Bearer <token>');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        throw new UnauthorizedError('No token provided');
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;

        if (!decoded.userId || !decoded.email || !decoded.role) {
            console.error('[AUTH] Invalid token payload - missing required fields');
            throw new UnauthorizedError('Invalid token payload');
        }

        if (!['admin', 'customer'].includes(decoded.role)) {
            console.error(`[AUTH] Invalid role in token: ${decoded.role}`);
            throw new UnauthorizedError('Invalid user role');
        }

        req.user = {
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role,
        };

        console.log(`[AUTH] User authenticated: ${decoded.email} (${decoded.role})`);
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            console.warn(`[AUTH] Token expired for user`);
            throw new UnauthorizedError('Token expired. Please login again.');
        }

        if (error instanceof jwt.JsonWebTokenError) {
            console.warn(`[AUTH] Invalid token: ${error.message}`);
            throw new UnauthorizedError('Invalid token');
        }

        if (error instanceof UnauthorizedError) {
            throw error;
        }

        console.error('[AUTH] Unexpected error during token verification:', error);
        throw new UnauthorizedError('Authentication failed');
    }
});

// Generate JWT token for authenticated user
export const generateToken = (userPayload: UserPayloadDTO): string => {
    const expiresIn = process.env.JWT_EXPIRES_IN;

    if (!['admin', 'customer'].includes(userPayload.role)) {
        throw new Error(`Invalid role: ${userPayload.role}. Must be 'admin' or 'customer'`);
    }

    return jwt.sign(userPayload, JWT_SECRET, { expiresIn } as jwt.SignOptions);
};

export default auth;
