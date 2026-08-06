# 📝 Todo App - Full Stack Application

A production-ready full-stack To-Do List application built with modern technologies and best practices.

## 🏗️ Architecture

This is a **Turborepo monorepo** with npm workspaces containing:

- **Frontend**: React 19 + Vite + TypeScript
- **Backend**: Express.js + Node.js + TypeScript  
- **Database**: PostgreSQL with Prisma ORM
- **Shared**: Types, UI components, ESLint configs, TypeScript configs

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+
- PostgreSQL 14+ (or use Docker)

### Installation

```bash
# Install all dependencies
npm install
```

### Development

```bash
# Start both frontend and backend in development mode
npm run dev

# Frontend: http://localhost:5173
# Backend: http://localhost:3001
```

### Build

```bash
# Build all packages
npm run build

# Production start
npm run start
```

## 📦 Project Structure

```
todo-app/
├── apps/
│   ├── api/              # Express backend
│   │   └── src/
│   │       ├── controllers/
│   │       ├── services/
│   │       ├── repositories/
│   │       ├── routes/
│   │       ├── middlewares/
│   │       └── validators/
│   └── web/              # React frontend
│       └── src/
│           ├── pages/
│           ├── components/
│           ├── hooks/
│           ├── config/
│           └── types/
├── packages/
│   ├── types/            # Shared TypeScript types
│   ├── ui/               # Shared UI components
│   ├── eslint-config/    # ESLint rules
│   └── tsconfig/         # TypeScript configs
├── prisma/               # Database schema & migrations
│   └── schema.prisma
└── turbo.json            # Turborepo configuration
```

## 🗄️ Database Setup

### Environment Variables

Create `.env` file in the root directory:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/todo_app_dev

# Backend
NODE_ENV=development
API_PORT=3001
API_HOST=http://localhost:3001
CORS_ORIGIN=http://localhost:5173

# Frontend
VITE_API_URL=http://localhost:3001
```

### Database Migrations

```bash
# Run migrations
npm run db:migrate

# Seed sample data
npm run db:seed
```

### Using Docker PostgreSQL

```bash
# Start PostgreSQL via Docker
docker run --name todo-db \
  -e POSTGRES_USER=todouser \
  -e POSTGRES_PASSWORD=todopass \
  -e POSTGRES_DB=todo_app \
  -p 5432:5432 \
  postgres:16-alpine

# Update DATABASE_URL in .env
DATABASE_URL=postgresql://todouser:todopass@localhost:5432/todo_app
```

## 🔌 API Endpoints

### Tasks
- `GET /api/tasks` - Get all tasks (with pagination)
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create task
- `PATCH /api/tasks/:id` - Update task
- `PATCH /api/tasks/:id/status` - Toggle task status
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/search?q=` - Search tasks
- `GET /api/tasks/weeks` - Get weekly grouped tasks

### Health
- `GET /health` - Health check endpoint
- `GET /` - API info

## 🎨 Features

### Frontend
- ✅ Responsive mobile-first design
- ✅ Weekly task grouping with progress tracking
- ✅ Search with debounce
- ✅ Task filtering by status and priority
- ✅ Real-time UI updates with optimistic rendering
- ✅ Toast notifications
- ✅ Loading and error states
- ✅ Dark mode ready (Tailwind CSS)

### Backend
- ✅ REST API with Express
- ✅ Input validation with Zod
- ✅ Error handling middleware
- ✅ CORS support
- ✅ Request logging with Morgan
- ✅ Security headers with Helmet
- ✅ Pagination support
- ✅ Health check endpoint

### Database
- ✅ PostgreSQL with Prisma ORM
- ✅ Automated migrations
- ✅ Seed data for testing
- ✅ Indexes for performance
- ✅ UUID primary keys

## 🧪 Testing & Quality

```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Format code
npm run format
npm run format:check

# Clean build artifacts
npm run clean
```

## 🐳 Docker

### Build & Run with Docker Compose

```bash
docker-compose up -d

# Frontend: http://localhost:5173
# Backend: http://localhost:3001
# PostgreSQL: localhost:5432
```

### Build Docker Image

```bash
docker build -t todo-app:latest .
docker run -p 3001:3001 -e DATABASE_URL=postgresql://... todo-app:latest
```

## 📈 Performance Optimizations

- ✅ React Query for efficient data fetching
- ✅ Debounced search queries
- ✅ Pagination for large datasets
- ✅ Database indexes on frequently queried fields
- ✅ Optimistic UI updates
- ✅ Tree-shaking with Vite
- ✅ Code splitting by route

## 🔐 Security

- ✅ CORS configured
- ✅ Security headers (Helmet)
- ✅ Input validation with Zod
- ✅ SQL injection prevention (Prisma ORM)
- ✅ XSS protection
- ✅ Strict TypeScript

## 📝 Type Safety

- ✅ Strict TypeScript configuration
- ✅ Shared types between frontend and backend
- ✅ Zod schemas for runtime validation
- ✅ Type-safe React hooks
- ✅ Type-safe API responses

## 🚀 Deployment

### Netlify (Frontend)

```bash
# Build
npm run build

# Deploy apps/web/dist to Netlify
```

Netlify configuration file should redirect API calls to backend.

### Render (Backend)

```bash
# Create new Web Service on Render
# Connect GitHub repository
# Set environment variables
# Deploy automatically on push
```

### Neon PostgreSQL

1. Create account at [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string
4. Set `DATABASE_URL` environment variable

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## 📚 Stack Details

### Frontend Stack
- **React 19** - UI library
- **Vite** - Build tool & dev server
- **TypeScript** - Type safety
- **React Router v7** - Routing
- **React Query** - Data fetching
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **TailwindCSS** - Styling
- **Lucide React** - Icons

### Backend Stack
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Prisma** - ORM
- **PostgreSQL** - Database
- **Zod** - Schema validation
- **Morgan** - HTTP logging
- **Helmet** - Security headers
- **CORS** - Cross-origin requests

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## 📄 License

MIT

## 📞 Support

For issues or questions, please open a GitHub issue.
