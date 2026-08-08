import type { TaskStatus, TaskPriority } from '../models/Task.js';

export interface TaskDTO {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export interface GetAllTasksQuery {
  skip?: number;
  take?: number;
  status?: TaskStatus;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  total?: number;
  page?: number;
  pageSize?: number;
  hasMore?: boolean;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface TaskListResponse extends PaginatedResponse<TaskDTO> {}

export interface TaskDetailResponse extends ApiResponse<TaskDTO> {}

export interface SearchResponse {
  success: boolean;
  data: TaskDTO[];
}

export interface DeleteResponse {
  success: boolean;
  message: string;
}

export interface CountResponse {
  success: boolean;
  data: {
    count: number;
  };
}
