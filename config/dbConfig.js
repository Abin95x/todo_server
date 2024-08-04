import mongoose from 'mongoose';

export const connectDB = async (MONGO_URL) => {
    try {
        await mongoose.connect(MONGO_URL);
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection error:', error);
    }
};
