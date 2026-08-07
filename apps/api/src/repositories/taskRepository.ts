import { Task, TaskStatus, TaskPriority } from '../models/Task.js';
import type { CreateTaskInput, UpdateTaskInput } from '@todo/types';

export const taskRepository = {
  async findAll(skip: number = 0, take: number = 50, status?: TaskStatus) {
    const query = status ? { status } : {};
    return Task.find(query)
      .sort({ dueDate: 1 })
      .skip(skip)
      .limit(take)
      .lean();
  },

  async findById(id: string) {
    return Task.findById(id).lean();
  },

  async create(data: CreateTaskInput) {
    const task = new Task({
      title: data.title,
      description: data.description || '',
      dueDate: data.dueDate,
      priority: data.priority || TaskPriority.MEDIUM,
      status: TaskStatus.IN_PROGRESS,
    });
    return task.save();
  },

  async update(id: string, data: UpdateTaskInput) {
    return Task.findByIdAndUpdate(id, data, { new: true }).lean();
  },

  async updateStatus(id: string, status: TaskStatus) {
    return Task.findByIdAndUpdate(id, { status }, { new: true }).lean();
  },

  async delete(id: string) {
    return Task.findByIdAndDelete(id);
  },

  async search(query: string) {
    if (!query || query.trim().length === 0) {
      return [];
    }

    return Task.find(
      { $text: { $search: query } },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(20)
      .lean();
  },

  async countAll() {
    return Task.countDocuments();
  },

  async getWeeklyTasks(weekStart: Date, weekEnd: Date) {
    return Task.find({
      dueDate: {
        $gte: weekStart,
        $lte: weekEnd,
      },
    })
      .sort({ dueDate: 1 })
      .lean();
  },
};
