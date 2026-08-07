import app from './app.js';
import { config } from './config/index.js';
import { connectDB } from './config/database.js';

const port = config.port;
const host = config.host;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    app.listen(port, () => {
      console.log(`Server is running on ${host}:${port}`);
      console.log(`Health check: ${host}:${port}/health`);
      console.log(`Database: MongoDB connected`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
