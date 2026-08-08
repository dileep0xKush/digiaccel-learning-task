import { Request, Response } from 'express';
import { taskService } from '../services/taskService.js';
import type { GetAllTasksQuery } from '../types/api.js';

export const taskController = {
  async getAllTasks(req: Request, res: Response) {
    const query: GetAllTasksQuery = {
      skip: parseInt(req.query.skip as string) || 0,
      take: parseInt(req.query.take as string) || 50,
      status: req.query.status as GetAllTasksQuery['status'],
    };

    const response = await taskService.getAllTasksFormatted(query);
    res.json(response);
  },

  async getTaskById(req: Request, res: Response) {
    const { id } = req.params;
    const response = await taskService.getTaskByIdFormatted(id);
    res.json(response);
  },

  async createTask(req: Request, res: Response) {
    const response = await taskService.createTaskFormatted(req.body);
    res.status(201).json(response);
  },

  async updateTask(req: Request, res: Response) {
    const { id } = req.params;
    const response = await taskService.updateTaskFormatted(id, req.body);
    res.json(response);
  },

  async updateTaskStatus(req: Request, res: Response) {
    const { id } = req.params;
    const { status } = req.body;
    const response = await taskService.updateTaskStatusFormatted(id, status);
    res.json(response);
  },

  async deleteTask(req: Request, res: Response) {
    const { id } = req.params;
    const response = await taskService.deleteTaskFormatted(id);
    res.json(response);
  },

  async searchTasks(req: Request, res: Response) {
    const query = req.query.q as string;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required',
      });
    }

    const response = await taskService.searchTasksFormatted(query);
    return res.json(response);
  },

  async getWeeklyTasks(_req: Request, res: Response) {
    const weeks = await taskService.getWeeklyTasks();

    res.json({
      success: true,
      data: weeks,
    });
  },

  async countAllTasks(_req: Request, res: Response) {
    const response = await taskService.countAllTasksFormatted();
    res.json(response);
  },
};
