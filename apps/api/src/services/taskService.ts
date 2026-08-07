import type { TaskStatus } from '../models/Task.js';
import { CreateTaskInput, UpdateTaskInput, WeeklyTasks } from '@todo/types';
import { taskRepository } from '../repositories/taskRepository.js';

export const taskService = {
  async getAllTasks(skip?: number, take?: number, status?: TaskStatus) {
    return taskRepository.findAll(skip, take, status);
  },

  async getTaskById(id: string) {
    const task = await taskRepository.findById(id);
    if (!task) {
      const error = new Error('Task not found');
      (error as any).statusCode = 404;
      throw error;
    }
    return task;
  },

  async createTask(data: CreateTaskInput) {
    return taskRepository.create(data);
  },

  async updateTask(id: string, data: UpdateTaskInput) {
    await this.getTaskById(id);
    return taskRepository.update(id, data);
  },

  async updateTaskStatus(id: string, status: TaskStatus) {
    await this.getTaskById(id);
    return taskRepository.updateStatus(id, status);
  },

  async deleteTask(id: string) {
    await this.getTaskById(id);
    return taskRepository.delete(id);
  },

  async searchTasks(query: string) {
    if (!query || query.trim().length === 0) {
      return [];
    }
    return taskRepository.search(query.trim());
  },

  async getWeeklyTasks(_weekNumber?: number): Promise<WeeklyTasks[]> {
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
      const openTasks = tasks.filter((t: any) => t.status === 'IN_PROGRESS').length;
      const completedTasks = tasks.filter((t: any) => t.status === 'COMPLETED').length;

      weeks.push({
        weekNumber: w + 1,
        weekStart: weekStart.toISOString(),
        weekEnd: weekEnd.toISOString(),
        openTasks,
        completedTasks,
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
  },

  async countAllTasks() {
    return taskRepository.countAll();
  },
};
