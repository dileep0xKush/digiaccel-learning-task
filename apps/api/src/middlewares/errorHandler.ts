import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { config } from '../config/index.js';

interface ApiError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: ApiError | ZodError | Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error('Error:', err);

  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: 'Validation error',
      details: err.errors,
    });
    return;
  }

  if (err instanceof Error) {
    const statusCode = (err as ApiError).statusCode || 500;
    res.status(statusCode).json({
      success: false,
      error: err.message || 'Internal server error',
      ...(config.nodeEnv === 'development' && { stack: err.stack }),
    });
    return;
  }

  res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
};
