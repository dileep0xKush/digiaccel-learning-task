import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  const now = new Date();

  const tasks = [
    {
      title: 'Setup project',
      description: 'Initialize the monorepo and install dependencies',
      dueDate: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
      priority: 'HIGH',
      status: 'IN_PROGRESS',
    },
    {
      title: 'Create database schema',
      description: 'Design and implement the PostgreSQL schema',
      dueDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
      priority: 'HIGH',
      status: 'IN_PROGRESS',
    },
    {
      title: 'Develop REST API',
      description: 'Build Express.js API endpoints for task management',
      dueDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
      priority: 'HIGH',
      status: 'IN_PROGRESS',
    },
    {
      title: 'Build React frontend',
      description: 'Create React components and pages',
      dueDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
    },
    {
      title: 'Write tests',
      description: 'Add comprehensive test coverage',
      dueDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
    },
    {
      title: 'Deploy to production',
      description: 'Setup CI/CD and deploy to Netlify and Render',
      dueDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
      priority: 'HIGH',
      status: 'IN_PROGRESS',
    },
    {
      title: 'Documentation',
      description: 'Write comprehensive documentation',
      dueDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
      priority: 'LOW',
      status: 'IN_PROGRESS',
    },
    {
      title: 'Code review',
      description: 'Review and approve pull requests',
      dueDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      priority: 'MEDIUM',
      status: 'COMPLETED',
    },
  ];

  for (const task of tasks) {
    await prisma.task.create({
      data: {
        ...task,
        priority: task.priority as any,
        status: task.status as any,
      },
    });
  }

  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
