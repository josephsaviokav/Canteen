import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
    // Server
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.string().default('5000'),

    // Database
    DB_NAME: z.string().optional(),
    DB_USERNAME: z.string().optional(),
    DB_PASSWORD: z.string().optional(),
    DB_HOST: z.string().optional(),
    DB_PORT: z.string().optional(),
    DIRECT_URL: z.string().optional(),

    // JWT
    JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
    JWT_EXPIRES_IN: z.string().default('7d'),

    // Bcrypt
    BCRYPT_SALT_ROUNDS: z.string().default('10'),

    // Cloudinary
    CLOUDINARY_CLOUD_NAME: z.string().min(1, 'CLOUDINARY_CLOUD_NAME is required').optional(),
    CLOUDINARY_API_KEY: z.string().min(1, 'CLOUDINARY_API_KEY is required').optional(),
    CLOUDINARY_API_SECRET: z.string().min(1, 'CLOUDINARY_API_SECRET is required').optional(),

    // Razorpay
    RAZORPAY_KEY_ID: z.string().min(1, 'RAZORPAY_KEY_ID is required').optional(),
    RAZORPAY_KEY_SECRET: z.string().min(1, 'RAZORPAY_KEY_SECRET is required').optional(),

    // CORS
    ALLOWED_ORIGINS: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    console.error('❌ Invalid environment variables:');
    parsed.error.issues.forEach(issue => {
        console.error(`   ${issue.path.join('.')}: ${issue.message}`);
    });
    process.exit(1);
}

export const env = parsed.data;