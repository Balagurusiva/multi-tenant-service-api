import mongoose, { mongo } from 'mongoose';

export const connectDB = async () : Promise<void> => {
    const mongoURI = process.env.DATABASE_URL;
    
    if (!mongoURI) {
        console.error('DATABASE_URL is not defined in environment variables');
        throw new Error('DATABASE_URL is not defined in environment variables');
    }

    try {
        const conn = await mongoose.connect(mongoURI);
        console.log('MongoDB connected successfully');
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });
        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
};