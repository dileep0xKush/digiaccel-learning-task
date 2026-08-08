import type { TaskStatus } from '../models/Task.js';
import { CreateTaskInput, UpdateTaskInput, WeeklyTasks } from '@todo/types';
import { taskRepository } from '../repositories/taskRepository.js';
import { responseFormatter } from './responseFormatter.js';
import { AppError } from '../utils/AppError.js';
import type {
  TaskListResponse,
  TaskDetailResponse,
  SearchResponse,
  DeleteResponse,
  CountResponse,
  GetAllTasksQuery,
} from '../types/api.js';

export const taskService = {
  async getAllTasks(skip?: number, take?: number, status?: TaskStatus) {
    return taskRepository.findAll(skip, take, status);
  },

  async getTaskById(id: string) {
    try {
      const task = await taskRepository.findById(id);
      if (!task) {
        throw new AppError(`Task with id ${id} not found`, 404);
      }
      return task;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(`Failed to fetch task: ${(error as Error).message}`, 500);
    }
  },

  async createTask(data: CreateTaskInput) {
    try {
      return await taskRepository.create(data);
    } catch (error) {
      throw new AppError(`Failed to create task: ${(error as Error).message}`, 400);
    }
  },

  async updateTask(id: string, data: UpdateTaskInput) {
    try {
      await this.getTaskById(id);
      return await taskRepository.update(id, data);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(`Failed to update task: ${(error as Error).message}`, 400);
    }
  },

  async updateTaskStatus(id: string, status: TaskStatus) {
    try {
      await this.getTaskById(id);
      return await taskRepository.updateStatus(id, status);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(`Failed to update task status: ${(error as Error).message}`, 400);
    }
  },

  async deleteTask(id: string) {
    try {
      await this.getTaskById(id);
      return await taskRepository.delete(id);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(`Failed to delete task: ${(error as Error).message}`, 400);
    }
  },

  async searchTasks(query: string) {
    try {
      if (!query || query.trim().length === 0) {
        return [];
      }
      return await taskRepository.search(query.trim());
    } catch (error) {
      throw new AppError(`Search failed: ${(error as Error).message}`, 400);
    }
  },

  async getWeeklyTasks(_weekNumber?: number): Promise<WeeklyTasks[]> {
    try {
      const today = new Date();
      const weeks: WeeklyTasks[] = [];

      for (let w = 0; w < 4; w++) {
        const weekStart = new Date(today);
        const dayOfWeek = weekStart.getDay();
        const diff = weekStart.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        weekStart.setDate(diff + w * 7);
        weekStart.setHours(0, 0, 0, 0);

        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);

        const tasks = await taskRepository.getWeeklyTasks(weekStart, weekEnd);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const openTasks = tasks.filter((t: any) => t.status === 'IN_PROGRESS').length;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const completedTasks = tasks.filter((t: any) => t.status === 'COMPLETED').length;

        weeks.push({
          weekNumber: w + 1,
          weekStart: weekStart.toISOString(),
          weekEnd: weekEnd.toISOString(),
          openTasks,
          completedTasks,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          tasks: tasks.map((t: any) => ({
            title: t.title,
            description: t.description || '',
            dueDate: t.dueDate.toISOString(),
            priority: t.priority,
            status: t.status,
            createdAt: t.createdAt.toISOString(),
            updatedAt: t.updatedAt.toISOString(),
            id: t._id.toString(),
          })),
        });
      }

      return weeks;
    } catch (error) {
      throw new AppError(`Failed to fetch weekly tasks: ${(error as Error).message}`, 500);
    }
  },

  async countAllTasks() {
    try {
      return await taskRepository.countAll();
    } catch (error) {
      throw new AppError(`Failed to count tasks: ${(error as Error).message}`, 500);
    }
  },

  async getAllTasksFormatted(query: GetAllTasksQuery): Promise<TaskListResponse> {
    const skip = query.skip || 0;
    const take = query.take || 50;

    const tasks = await this.getAllTasks(skip, take, query.status);
    const total = await this.countAllTasks();

    return {
      success: true,
      data: responseFormatter.formatTasks(tasks),
      total,
      page: Math.floor(skip / take) + 1,
      pageSize: take,
      hasMore: skip + take < total,
    };
  },

  async getTaskByIdFormatted(id: string): Promise<TaskDetailResponse> {
    const task = await this.getTaskById(id);
    return {
      success: true,
      data: responseFormatter.formatTask(task),
    };
  },

  async createTaskFormatted(data: CreateTaskInput): Promise<TaskDetailResponse> {
    const task = await this.createTask(data);
    return {
      success: true,
      data: responseFormatter.formatTask(task),
    };
  },

  async updateTaskFormatted(id: string, data: UpdateTaskInput): Promise<TaskDetailResponse> {
    const task = await this.updateTask(id, data);
    return {
      success: true,
      data: responseFormatter.formatTask(task),
    };
  },

  async updateTaskStatusFormatted(id: string, status: TaskStatus): Promise<TaskDetailResponse> {
    const task = await this.updateTaskStatus(id, status);
    return {
      success: true,
      data: responseFormatter.formatTask(task),
    };
  },

  async deleteTaskFormatted(id: string): Promise<DeleteResponse> {
    await this.deleteTask(id);
    return {
      success: true,
      message: 'Task deleted successfully',
    };
  },

  async searchTasksFormatted(query: string): Promise<SearchResponse> {
    const tasks = await this.searchTasks(query);
    return {
      success: true,
      data: responseFormatter.formatTasks(tasks),
    };
  },

  async countAllTasksFormatted(): Promise<CountResponse> {
    const count = await this.countAllTasks();
    return {
      success: true,
      data: { count },
    };
  },
};
