import { Request, Response } from 'express';
import { taskService } from '../services/taskService.js';
import type { TaskStatus } from '../models/Task.js';

export const taskController = {
  async getAllTasks(req: Request, res: Response) {
    const skip = parseInt(req.query.skip as string) || 0;
    const take = parseInt(req.query.take as string) || 50;
    const status = req.query.status as TaskStatus | undefined;

    const tasks = await taskService.getAllTasks(skip, take, status);
    const total = await taskService.countAllTasks();

    res.json({
      success: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: tasks.map((t: any) => ({
        title: t.title,
        description: t.description || '',
        dueDate: t.dueDate.toISOString(),
        priority: t.priority,
        status: t.status,
        createdAt: t.createdAt.toISOString(),
        updatedAt: t.updatedAt.toISOString(),
        id: t._id?.toString() || t.id,
      })),
      total,
      page: Math.floor(skip / take) + 1,
      pageSize: take,
      hasMore: skip + take < total,
    });
  },

  async getTaskById(req: Request, res: Response) {
    const { id } = req.params;
    const task = await taskService.getTaskById(id);

    if (!task) {
      res.status(404).json({
        success: false,
        message: 'Task not found',
      });
      return;
    }

    res.json({
      success: true,
      data: {
        title: task.title,
        description: task.description || '',
        dueDate: task.dueDate.toISOString(),
        priority: task.priority,
        status: task.status,
        createdAt: task.createdAt.toISOString(),
        updatedAt: task.updatedAt.toISOString(),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        id: (task as any)._id?.toString() || task.id,
      },
    });
  },

  async createTask(req: Request, res: Response) {
    const task = await taskService.createTask(req.body);

    res.status(201).json({
      success: true,
      data: {
        title: task.title,
        description: task.description || '',
        dueDate: task.dueDate.toISOString(),
        priority: task.priority,
        status: task.status,
        createdAt: task.createdAt.toISOString(),
        updatedAt: task.updatedAt.toISOString(),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        id: (task as any)._id?.toString() || task.id,
      },
    });
  },

  async updateTask(req: Request, res: Response) {
    const { id } = req.params;
    const task = await taskService.updateTask(id, req.body);

    if (!task) {
      res.status(404).json({
        success: false,
        message: 'Task not found',
      });
      return;
    }

    res.json({
      success: true,
      data: {
        title: task.title,
        description: task.description || '',
        dueDate: task.dueDate.toISOString(),
        priority: task.priority,
        status: task.status,
        createdAt: task.createdAt.toISOString(),
        updatedAt: task.updatedAt.toISOString(),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        id: (task as any)._id?.toString() || task.id,
      },
    });
  },

  async updateTaskStatus(req: Request, res: Response) {
    const { id } = req.params;
    const { status } = req.body;
    const task = await taskService.updateTaskStatus(id, status);

    if (!task) {
      res.status(404).json({
        success: false,
        message: 'Task not found',
      });
      return;
    }

    res.json({
      success: true,
      data: {
        title: task.title,
        description: task.description || '',
        dueDate: task.dueDate.toISOString(),
        priority: task.priority,
        status: task.status,
        createdAt: task.createdAt.toISOString(),
        updatedAt: task.updatedAt.toISOString(),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        id: (task as any)._id?.toString() || task.id,
      },
    });
  },

  async deleteTask(req: Request, res: Response) {
    const { id } = req.params;
    await taskService.deleteTask(id);

    res.json({
      success: true,
      message: 'Task deleted successfully',
    });
  },

  async searchTasks(req: Request, res: Response) {
    const query = req.query.q as string;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required',
      });
    }

    const tasks = await taskService.searchTasks(query);

    return res.json({
      success: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: tasks.map((t: any) => ({
        title: t.title,
        description: t.description || '',
        dueDate: t.dueDate.toISOString(),
        priority: t.priority,
        status: t.status,
        createdAt: t.createdAt.toISOString(),
        updatedAt: t.updatedAt.toISOString(),
        id: t._id?.toString() || t.id,
      })),
    });
  },

  async getWeeklyTasks(_req: Request, res: Response) {
    const weeks = await taskService.getWeeklyTasks();

    res.json({
      success: true,
      data: weeks,
    });
  },

  async countAllTasks(_req: Request, res: Response) {
    const count = await taskService.countAllTasks();

    res.json({
      success: true,
      data: { count },
    });
  },
};
