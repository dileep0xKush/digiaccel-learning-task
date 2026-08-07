import dotenv from 'dotenv';

dotenv.config();

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.API_PORT || '3001', 10),
  host: process.env.API_HOST || 'http://localhost:3001',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/todo_app',
};

if (!config.mongoUri) {
  throw new Error('MONGODB_URI environment variable is not set');
}
