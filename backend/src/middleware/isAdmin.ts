import type { Request, Response, NextFunction } from 'express';

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    try {
        // Check if user role is admin
        if (req.user?.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admins only.'
            });
        }

        // Continue to next middleware/controller
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error in admin check'
        });
    }
}

export default isAdmin;