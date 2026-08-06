import express, { Express, Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/index.js';
import taskRoutes from './routes/tasks.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app: Express = express();

app.use(helmet());
app.use(cors({ origin: config.corsOrigin }));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Welcome to Todo API',
    version: '1.0.0',
    endpoints: {
      tasks: '/api/tasks',
      health: '/health',
    },
  });
});

app.use('/api/tasks', taskRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

app.use(errorHandler);

export default app;
