import { Request, Response } from 'express';
import { taskService } from '../services/taskService.js';
import { Status } from '@prisma/client';

export const taskController = {
  async getAllTasks(req: Request, res: Response) {
    const skip = parseInt(req.query.skip as string) || 0;
    const take = parseInt(req.query.take as string) || 50;
    const status = req.query.status as Status | undefined;

    const tasks = await taskService.getAllTasks(skip, take, status);
    const total = await taskService.countAllTasks();

    res.json({
      success: true,
      data: tasks.map((t) => ({
        ...t,
        dueDate: t.dueDate.toISOString(),
        createdAt: t.createdAt.toISOString(),
        updatedAt: t.updatedAt.toISOString(),
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

    res.json({
      success: true,
      data: {
        ...task,
        dueDate: task.dueDate.toISOString(),
        createdAt: task.createdAt.toISOString(),
        updatedAt: task.updatedAt.toISOString(),
      },
    });
  },

  async createTask(req: Request, res: Response) {
    const task = await taskService.createTask(req.body);

    res.status(201).json({
      success: true,
      data: {
        ...task,
        dueDate: task.dueDate.toISOString(),
        createdAt: task.createdAt.toISOString(),
        updatedAt: task.updatedAt.toISOString(),
      },
    });
  },

  async updateTask(req: Request, res: Response) {
    const { id } = req.params;
    const task = await taskService.updateTask(id, req.body);

    res.json({
      success: true,
      data: {
        ...task,
        dueDate: task.dueDate.toISOString(),
        createdAt: task.createdAt.toISOString(),
        updatedAt: task.updatedAt.toISOString(),
      },
    });
  },

  async updateTaskStatus(req: Request, res: Response) {
    const { id } = req.params;
    const { status } = req.body;
    const task = await taskService.updateTaskStatus(id, status);

    res.json({
      success: true,
      data: {
        ...task,
        dueDate: task.dueDate.toISOString(),
        createdAt: task.createdAt.toISOString(),
        updatedAt: task.updatedAt.toISOString(),
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
      data: tasks.map((t) => ({
        ...t,
        dueDate: t.dueDate.toISOString(),
        createdAt: t.createdAt.toISOString(),
        updatedAt: t.updatedAt.toISOString(),
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
