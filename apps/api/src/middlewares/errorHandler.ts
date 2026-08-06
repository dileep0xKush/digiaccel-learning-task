import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { config } from '../config/index.js';

interface ApiError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: ApiError | ZodError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      details: err.errors,
    });
  }

  if (err instanceof Error) {
    const statusCode = (err as ApiError).statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      error: err.message || 'Internal server error',
      ...(config.nodeEnv === 'development' && { stack: err.stack }),
    });
  }

  res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
};
