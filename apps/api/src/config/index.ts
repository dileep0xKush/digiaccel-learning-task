import dotenv from 'dotenv';

dotenv.config();

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.API_PORT || '3001', 10),
  host: process.env.API_HOST || 'http://localhost:3001',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  databaseUrl: process.env.DATABASE_URL || '',
};

if (!config.databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set');
}
