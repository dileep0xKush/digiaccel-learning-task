# 📋 Todo List App

A modern, fully-responsive todo management application with task scheduling, weekly organization, and real-time progress tracking.

## ✨ Features

### Task Management
- ✅ **Create Tasks** - Add tasks with title, description, date/time, and priority
- ✅ **Edit Tasks** - Update any task attribute
- ✅ **Delete Tasks** - Remove completed or unwanted tasks
- ✅ **Search Tasks** - Find tasks by keyword
- ✅ **Status Tracking** - Mark tasks as In Progress or Completed

### Weekly Organization
- 📅 **Weekly Cards** - Tasks grouped by week (Monday-Sunday)
- 📊 **Progress Tracking** - Visual progress bar and completion percentage
- 🔢 **Task Counts** - See open vs completed tasks per week
- 🎯 **Quick Stats** - At-a-glance overview of your workload

### Smart Indicators
- 🔴 **Overdue** - Tasks past their due date are flagged
- 📍 **Today** - Easy identification of today's tasks
- ⚡ **Priority Levels** - Low, Medium, High priority badges
- ✔️ **Completion Status** - Visual feedback for completed tasks

### Modern UI/UX
- 📱 **Mobile-First Design** - Fully responsive and touch-friendly
- 🎨 **Modern Aesthetics** - Gradient backgrounds, smooth animations
- 🌈 **Color-Coded** - Visual hierarchy with status-specific colors
- ⚡ **Smooth Interactions** - Fluid animations and transitions

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **React Query** - State management
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime
- **Express.js** - API framework
- **TypeScript** - Type safety
- **Prisma ORM** - Database management
- **PostgreSQL** - Database

### DevOps
- **Turbo** - Monorepo management
- **Docker** - Containerization (optional)

## 📦 Project Structure

```
├── apps/
│   ├── api/                 # Express backend
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── repositories/
│   │   │   ├── routes/
│   │   │   ├── middlewares/
│   │   │   └── config/
│   │   └── package.json
│   └── web/                 # React frontend
│       ├── src/
│       │   ├── pages/
│       │   ├── components/
│       │   ├── hooks/
│       │   ├── config/
│       │   └── main.tsx
│       └── package.json
├── packages/
│   ├── types/              # Shared TypeScript types
│   ├── ui/                 # Shared UI components
│   ├── tsconfig/           # Shared TypeScript config
│   └── eslint-config/      # Shared ESLint config
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── migrations/         # Database migrations
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+
- PostgreSQL 12+

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd digiaccel-learning-task
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file in root directory
   cp .env.example .env
   
   # Update with your values:
   # DATABASE_URL=postgresql://username:password@localhost:5432/todo_app
   # API_PORT=3002
   # VITE_API_URL=http://localhost:3002
   ```

4. **Set up PostgreSQL database**
   ```bash
   # Start PostgreSQL service
   sudo service postgresql start
   
   # Run database migrations
   npx prisma migrate deploy
   ```

5. **Start development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Frontend: http://localhost:5176
   - API: http://localhost:3002

## 📝 Usage

### Creating a Task
1. Click the floating action button (+ icon)
2. Fill in task details:
   - **Title** (required)
   - **Description** (optional)
   - **Date & Time** (required)
   - **Priority** (Low, Medium, High)
3. Click "Create Task"

### Managing Tasks
- **Mark as Complete** - Click the checkbox next to a task
- **Edit Task** - Click the task or edit icon
- **Delete Task** - Open task details and click delete
- **Search** - Click search icon and enter keywords

### Viewing Progress
- Tasks are organized by week
- Each week shows open and completed task counts
- Progress bar shows completion percentage
- Click week card to expand/collapse tasks

## 🔌 API Endpoints

### Base URL: `http://localhost:3002`

#### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get task by ID
- `PATCH /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

#### Search & Analytics
- `GET /api/tasks/search?q=query` - Search tasks
- `GET /api/tasks/weeks` - Get weekly task summary

#### Health
- `GET /health` - API health check

## 🗄️ Database Schema

### Tasks Table
```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT DEFAULT '',
  due_date TIMESTAMP NOT NULL,
  priority ENUM('LOW', 'MEDIUM', 'HIGH') DEFAULT 'MEDIUM',
  status ENUM('IN_PROGRESS', 'COMPLETED') DEFAULT 'IN_PROGRESS',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX(due_date),
  INDEX(status),
  INDEX(priority)
);
```

## 🧪 Testing

### Manual Testing
See `TEST_CHECKLIST.md` for comprehensive testing guide.

### Running Tests
```bash
# Run all tests
npm run test

# Run specific package tests
npm run test -- --filter=@todo/api
npm run test -- --filter=@todo/web
```

## 📊 Performance Optimizations

- ✅ Lazy loading of routes
- ✅ Code splitting with Vite
- ✅ Efficient database queries with Prisma
- ✅ Optimistic UI updates
- ✅ Minimal re-renders with React Query

## 🔒 Security Features

- ✅ CORS protection
- ✅ Helmet security headers
- ✅ Input validation with Zod
- ✅ Type safety with TypeScript
- ✅ Environment variable isolation

## 🚢 Deployment

### Deploying to Netlify

1. **Build frontend**
   ```bash
   npm run build
   ```

2. **Connect to Netlify**
   - Push code to GitHub
   - Connect repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `apps/web/dist`

3. **Deploy backend** (Heroku/Railway)
   - Push code to version control
   - Connect to deployment platform
   - Set environment variables
   - Deploy

## 📈 Future Enhancements

- 🔔 Push notifications for due tasks
- 👥 Collaborative task sharing
- 📱 Native mobile apps (React Native)
- 🤖 AI-powered task suggestions
- 📊 Advanced analytics dashboard
- 🎨 Custom themes
- 🔐 Two-factor authentication

## 📄 License

MIT License - See LICENSE file for details

## 👤 Author

Created by Claude Code

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

**Happy Task Managing! 🎯**
