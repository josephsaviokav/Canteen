import type { Request, Response, NextFunction } from 'express';
import { asyncHandler } from './errorHandler.js';
import { ForbiddenError } from '../utils/errors.js';

const isAdmin = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== 'admin') {
        throw new ForbiddenError('Access denied: Admins only');
    }
    next();
});

export default isAdmin;
