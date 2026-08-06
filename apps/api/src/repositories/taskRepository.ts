import { PrismaClient, Priority, Status } from '@prisma/client';
import { CreateTaskInput, UpdateTaskInput } from '@todo/types';

const prisma = new PrismaClient();

export const taskRepository = {
  async findAll(skip = 0, take = 50, status?: Status) {
    const where = status ? { status } : {};
    return prisma.task.findMany({
      where,
      skip,
      take,
      orderBy: { dueDate: 'asc' },
    });
  },

  async findById(id: string) {
    return prisma.task.findUnique({
      where: { id },
    });
  },

  async create(data: CreateTaskInput) {
    return prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        dueDate: new Date(data.dueDate),
        priority: data.priority as Priority,
        status: data.status as Status,
      },
    });
  },

  async update(id: string, data: UpdateTaskInput) {
    return prisma.task.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.dueDate && { dueDate: new Date(data.dueDate) }),
        ...(data.priority && { priority: data.priority as Priority }),
        ...(data.status && { status: data.status as Status }),
      },
    });
  },

  async updateStatus(id: string, status: Status) {
    return prisma.task.update({
      where: { id },
      data: { status },
    });
  },

  async delete(id: string) {
    return prisma.task.delete({
      where: { id },
    });
  },

  async search(query: string) {
    return prisma.task.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      orderBy: { dueDate: 'asc' },
    });
  },

  async countAll() {
    return prisma.task.count();
  },

  async getWeeklyTasks(weekStart: Date, weekEnd: Date) {
    return prisma.task.findMany({
      where: {
        dueDate: {
          gte: weekStart,
          lte: weekEnd,
        },
      },
      orderBy: { dueDate: 'asc' },
    });
  },
};
