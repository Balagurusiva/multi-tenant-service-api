import mongoose, { mongo } from 'mongoose';
import { logger } from '../utils/logger';

export const connectDB = async () : Promise<void> => {
    const mongoURI = process.env.DATABASE_URL;
    
    if (!mongoURI) {
        logger.error('DATABASE_URL is not defined in environment variables');
        throw new Error('DATABASE_URL is not defined in environment variables');
    }

    try {
        const conn = await mongoose.connect(mongoURI);
        logger.info('MongoDB connected successfully');
        mongoose.connection.on('error', (err) => {
            logger.error('MongoDB connection error:', err);
        });
        mongoose.connection.on('disconnected', () => {
            logger.info('MongoDB disconnected');
        });
    } catch (error) {
        logger.error({ error }, 'MongoDB connection error');
        throw error;
    }
};