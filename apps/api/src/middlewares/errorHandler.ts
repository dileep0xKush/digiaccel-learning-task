import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { config } from '../config/index.js';
import { AppError } from '../utils/AppError.js';

export const errorHandler = (
  err: Error | ZodError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const path = req.path;

  console.error(`[${timestamp}] ERROR - ${method} ${path}:`, err);

  if (err instanceof ZodError) {
    console.warn(`[${timestamp}] Validation failed for ${method} ${path}`);
    res.status(400).json({
      success: false,
      error: 'Validation error',
      details: err.errors,
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
      timestamp,
    });
    return;
  }

  if (err instanceof Error) {
    const errorResponse: Record<string, unknown> = {
      success: false,
      error: 'Internal server error',
      timestamp,
    };

    if (config.nodeEnv === 'development') {
      errorResponse.message = err.message;
      errorResponse.stack = err.stack;
    }

    res.status(500).json(errorResponse);
    return;
  }

  res.status(500).json({
    success: false,
    error: 'Internal server error',
    timestamp,
  });
};
