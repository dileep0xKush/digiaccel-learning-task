import type { TaskDTO } from '../types/api.js';

export const responseFormatter = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formatTask(task: any): TaskDTO {
    return {
      title: task.title,
      description: task.description || '',
      dueDate: task.dueDate.toISOString(),
      priority: task.priority,
      status: task.status,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
      id: task._id?.toString() || task.id,
    };
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formatTasks(tasks: any[]): TaskDTO[] {
    return tasks.map((task) => this.formatTask(task));
  },
};
