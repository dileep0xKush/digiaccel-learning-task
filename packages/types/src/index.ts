import { z } from 'zod';

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export enum TaskStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export const TaskPrioritySchema = z.enum(['LOW', 'MEDIUM', 'HIGH']);
export const TaskStatusSchema = z.enum(['IN_PROGRESS', 'COMPLETED']);

export const TaskSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().optional().default(''),
  dueDate: z.string().datetime().or(z.string().date()),
  priority: TaskPrioritySchema,
  status: TaskStatusSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().optional().default(''),
  dueDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date format'),
  priority: TaskPrioritySchema.default('MEDIUM'),
  status: TaskStatusSchema.default('IN_PROGRESS'),
});

export const UpdateTaskSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  dueDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), 'Invalid date format')
    .optional(),
  priority: TaskPrioritySchema.optional(),
  status: TaskStatusSchema.optional(),
});

export const UpdateTaskStatusSchema = z.object({
  status: TaskStatusSchema,
});

export type Task = z.infer<typeof TaskSchema>;
export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;
export type UpdateTaskStatusInput = z.infer<typeof UpdateTaskStatusSchema>;

export interface WeeklyTasks {
  weekNumber: number;
  weekStart: string;
  weekEnd: string;
  openTasks: number;
  completedTasks: number;
  tasks: Task[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
