import type { Request, Response, NextFunction } from 'express';
import { asyncHandler } from './errorHandler';
import { ForbiddenError } from '../utils/errors';

const isAdmin = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== 'admin') {
        throw new ForbiddenError('Access denied: Admins only');
    }
    next();
});

export default isAdmin;
