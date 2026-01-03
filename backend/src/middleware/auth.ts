import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request type to include user data
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                role: 'admin' | 'customer';
            };
        }
    }
}

// JWT Secret from environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'abcd1234defaultsecret';

const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: 'No token provided. Please login first.'
            });
        }

        // Check if header starts with "Bearer "
        if (!authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token format. Use: Bearer <token>'
            });
        }

        // Extract token (remove "Bearer " prefix)
        const token = authHeader.substring(7);

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token is empty'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET) as {
            id: string;
            email: string;
            role: 'admin' | 'customer';
        };

        // Attach user data to request object
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role
        };

        // Continue to next middleware/controller
        next();

    } catch (error: any) {
        // Token verification failed
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token has expired. Please login again.'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Authentication failed'
        });
    }
};

export const generateToken = (userId: string, email: string, role: 'admin' | 'customer'): string => {
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
    
    return jwt.sign(
        { 
            id: userId, 
            email: email,
            role: role
        },
        JWT_SECRET,
        { expiresIn } as jwt.SignOptions
    );
};

export default auth;
