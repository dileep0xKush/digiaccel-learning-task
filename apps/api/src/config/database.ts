import mongoose from 'mongoose';
import { config } from './index.js';

export const connectDB = async () => {
  try {
    const mongoUri = config.mongoUri;

    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    await mongoose.connect(mongoUri);

    console.log(' MongoDB connected successfully');
    return mongoose.connection;
  } catch (error) {
    console.error(' MongoDB connection failed:', error);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log(' MongoDB disconnected');
  } catch (error) {
    console.error(' MongoDB disconnection failed:', error);
    process.exit(1);
  }
};
