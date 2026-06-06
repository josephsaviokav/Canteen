import { UploadApiResponse } from 'cloudinary';
import cloudinary from '../config/cloudinary';

export const uploadImage = async (
    fileBuffer: Buffer,
    folder: string
): Promise<string> => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: 'image',
                transformation: [
                    { width: 800, crop: 'limit' }, 
                    { quality: 'auto' },            
                    { fetch_format: 'auto' },       
                ],
            },
            (error, result: UploadApiResponse | undefined) => {
                if (error) reject(error);
                else resolve(result!.secure_url);
            }
        );
        stream.end(fileBuffer);
    });
};

export const deleteImage = async (imageUrl: string): Promise<void> => {
    // extract public_id from URL
    const publicId = imageUrl.split('/').slice(-2).join('/').split('.')[0];
    await cloudinary.uploader.destroy(publicId);
};