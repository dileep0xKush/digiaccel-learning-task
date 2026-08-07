import { CreateTaskSchema, UpdateTaskSchema, UpdateTaskStatusSchema } from '@todo/types';
import { Request, Response, NextFunction } from 'express';

export const validateCreateTask = (req: Request, _res: Response, next: NextFunction) => {
  try {
    req.body = CreateTaskSchema.parse(req.body);
    next();
  } catch (error) {
    next(error);
  }
};

export const validateUpdateTask = (req: Request, _res: Response, next: NextFunction) => {
  try {
    req.body = UpdateTaskSchema.parse(req.body);
    next();
  } catch (error) {
    next(error);
  }
};

export const validateUpdateTaskStatus = (req: Request, _res: Response, next: NextFunction) => {
  try {
    req.body = UpdateTaskStatusSchema.parse(req.body);
    next();
  } catch (error) {
    next(error);
  }
};
