# 🏗️ Architecture Guide

This document describes the architectural decisions, design patterns, and principles used in the Todo App.

## Overview

The Todo App is built as a **Turborepo monorepo** with clear separation between frontend, backend, and shared packages. This architecture enables:

- **Code reuse** across frontend and backend
- **Type safety** with shared TypeScript types
- **Scalability** by organizing code into focused packages
- **Maintainability** with clear responsibility boundaries
- **Deployability** with independent deployment of frontend/backend

## Monorepo Structure

```
todo-app (root)
├── apps/
│   ├── web/          (React Frontend)
│   └── api/          (Express Backend)
├── packages/
│   ├── types/        (Shared Types)
│   ├── ui/           (Shared UI Components)
│   ├── eslint-config/ (ESLint Rules)
│   └── tsconfig/     (TypeScript Config)
└── prisma/           (Database Schema)
```

### Benefits of This Structure

1. **Shared Types**: Single source of truth for API contracts
2. **Shared UI**: Consistent components across applications
3. **Shared Config**: Unified ESLint and TypeScript settings
4. **Single Dependencies**: Deduplicated node_modules
5. **Parallel Development**: Teams can work independently
6. **Easy Testing**: Test entire stack with single command

## Backend Architecture

### Clean Architecture Layers

```
Controllers (HTTP handlers)
    ↓
Services (Business logic)
    ↓
Repositories (Data access)
    ↓
Database (PostgreSQL)
```

### Layer Responsibilities

#### Controllers (`controllers/`)
- Handle HTTP requests/responses
- Parse query parameters and body
- Call services with validated input
- Return properly formatted responses
- Should NOT contain business logic

Example:
```typescript
async getAllTasks(req: Request, res: Response) {
  const tasks = await taskService.getAllTasks();
  res.json({ success: true, data: tasks });
}
```

#### Services (`services/`)
- Contain business logic
- Orchestrate between controllers and repositories
- Perform calculations and transformations
- Handle application errors
- Should NOT interact directly with HTTP

Example:
```typescript
async createTask(data: CreateTaskInput) {
  // Validation, business rules
  return taskRepository.create(data);
}
```

#### Repositories (`repositories/`)
- Abstract database operations
- Execute queries using Prisma
- Return raw data from database
- Should NOT contain business logic
- Easy to mock for testing

Example:
```typescript
async findById(id: string) {
  return prisma.task.findUnique({ where: { id } });
}
```

#### Validators (`validators/`)
- Validate incoming data with Zod
- Run on middleware
- Convert runtime types
- Ensure type safety

Example:
```typescript
export const validateCreateTask = (req, res, next) => {
  req.body = CreateTaskSchema.parse(req.body);
  next();
};
```

### Request Flow

```
HTTP Request
    ↓
Morgan (logging)
    ↓
Cors & Helmet (security)
    ↓
bodyParser (parsing)
    ↓
Validator (validation)
    ↓
Controller (handler)
    ↓
Service (logic)
    ↓
Repository (data)
    ↓
Database (storage)
    ↓
Response (JSON)
```

### Error Handling

Centralized error handling in middleware:

```typescript
// All errors caught and formatted consistently
try {
  await taskService.getTask(id);
} catch (error) {
  // errorHandler middleware catches and formats
  next(error);
}
```

Benefits:
- Consistent error format across all endpoints
- Proper HTTP status codes
- Detailed error messages in development
- Safe error messages in production

## Frontend Architecture

### Page-Based Structure

```
pages/           → Route components (full pages)
  ├── HomePage.tsx
  ├── SearchPage.tsx
  └── EditTaskPage.tsx

components/      → Reusable components
  ├── TaskForm.tsx
  ├── TaskItem.tsx
  ├── WeeklyCard.tsx
  └── SearchBar.tsx

hooks/          → Custom React hooks
  ├── useTasks.ts       (API operations)
  ├── useToast.ts       (Toast notifications)
  └── useDebounce.ts    (Debouncing)

config/         → Application configuration
  ├── api.ts            (Axios instance)
  └── query.ts          (React Query setup)
```

### Component Design

#### Smart vs Dumb Components

**Smart Components** (Pages, Containers)
- Connect to React Query hooks
- Manage complex state
- Handle side effects
- Compose UI components

Example:
```typescript
export default function HomePage() {
  const { data: weeks } = useWeeklyTasks();
  const [isFormOpen, setIsFormOpen] = useState(false);
  return <WeeklyCard week={weeks[0]} />;
}
```

**Dumb Components** (UI, Presentational)
- Receive data via props
- Render UI
- Handle simple interactions
- Reusable across pages

Example:
```typescript
interface TaskItemProps {
  task: Task;
  onToggle: () => void;
}
export default function TaskItem({ task, onToggle }: TaskItemProps) {
  return <div onClick={onToggle}>{task.title}</div>;
}
```

### State Management

**React Query** (Server state)
- API data fetching
- Caching
- Automatic refetching
- Loading/error states

Example:
```typescript
const { data, isLoading, error } = useWeeklyTasks();
```

**React Hook Form** (Form state)
- Form validation
- Input binding
- Error handling
- Submission

Example:
```typescript
const { register, handleSubmit } = useForm();
<input {...register('title')} />
```

**Local React State** (UI state)
- Toggle modals/dropdowns
- Track active filters
- Temporary UI state

Example:
```typescript
const [isOpen, setIsOpen] = useState(false);
```

### Data Flow

```
Page Component
    ↓
Custom Hooks (useTasks, useToast)
    ↓
React Query / React Hook Form
    ↓
API Client (Axios)
    ↓
REST API
    ↓
Database
```

## Database Design

### Entity-Relationship

```
Task
├── id (UUID, primary key)
├── title (string)
├── description (string)
├── dueDate (datetime, indexed)
├── priority (enum: LOW, MEDIUM, HIGH, indexed)
├── status (enum: IN_PROGRESS, COMPLETED, indexed)
├── createdAt (datetime)
└── updatedAt (datetime, auto-updated)
```

### Indexing Strategy

```prisma
@@index([dueDate])      # For date range queries
@@index([status])       # For filtering by status
@@index([priority])     # For filtering by priority
```

### Schema Evolution

Migrations track all schema changes:
1. Edit `schema.prisma`
2. Run `npm run db:migrate:dev`
3. Review migration
4. Commit both schema and migration

## Type Safety

### Shared Types (`packages/types/`)

Single source of truth for all types:

```typescript
// Database types
export type Task = { id: string; title: string; ... }

// API request types
export type CreateTaskInput = { title: string; ... }

// API response types
export type ApiResponse<T> = { success: boolean; data: T }
```

### Zod Schemas

Runtime validation with TypeScript inference:

```typescript
const CreateTaskSchema = z.object({
  title: z.string().min(1),
  dueDate: z.string().datetime(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
});

type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
```

### Benefits

- Frontend and backend share exact types
- Runtime validation matches TypeScript types
- Catch errors at compile-time and runtime
- Self-documenting API contracts

## API Design

### RESTful Principles

```
GET    /api/tasks              - List all
GET    /api/tasks/:id          - Get one
POST   /api/tasks              - Create
PATCH  /api/tasks/:id          - Update
DELETE /api/tasks/:id          - Delete
PATCH  /api/tasks/:id/status   - Partial update
GET    /api/tasks/search?q=    - Search
GET    /api/tasks/weeks        - Group by week
```

### Response Format

Consistent response structure:

```typescript
{
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  total?: number;        // Pagination
  page?: number;         // Pagination
  pageSize?: number;     // Pagination
  hasMore?: boolean;     // Pagination
}
```

### Error Handling

```typescript
{
  success: false;
  error: "Error message";
  details?: ZodError[];
}
```

## Performance Optimizations

### Frontend

1. **React Query Caching**
   - Automatic cache invalidation
   - Stale time: 5 minutes
   - Cache time: 10 minutes

2. **Debounced Search**
   - Reduce API calls
   - 300ms debounce delay
   - Smooth user experience

3. **Code Splitting**
   - Route-based chunks
   - Lazy load components
   - Reduce initial bundle

4. **Optimistic Updates**
   - Update UI immediately
   - Rollback on error
   - Better perceived performance

### Backend

1. **Database Indexes**
   - Index frequently queried fields
   - Speed up filters and sorts
   - Reduce query time

2. **Pagination**
   - Limit result sets
   - Default: 50 items per page
   - Configurable via query params

3. **Caching Headers**
   - Cache static assets
   - Set appropriate TTLs
   - Reduce bandwidth

## Security Considerations

### Frontend
- **Input validation** with Zod
- **XSS protection** via React escaping
- **CSRF tokens** if needed
- **Secure storage** of auth tokens

### Backend
- **Input validation** with Zod before processing
- **SQL injection prevention** via Prisma ORM
- **CORS configuration** for allowed origins
- **Security headers** via Helmet
- **Rate limiting** if needed
- **HTTPS enforcement** in production

### Database
- **Connection encryption** in transit
- **Prepared statements** via Prisma
- **Principle of least privilege** for DB user
- **Backups** enabled
- **Audit logging** if needed

## Deployment Architecture

```
GitHub Repository
    ↓
├── Push to main
│   ├── CI/CD Pipeline (GitHub Actions)
│   ├── Tests & Linting
│   └── Build
│       ├── Frontend → Netlify CDN
│       └── Backend → Render Container
│
└── Database
    └── Neon PostgreSQL
```

### Deployment Flow

1. **Code Push** → GitHub repository
2. **CI Pipeline** → Tests, lint, build
3. **Frontend** → Built SPA, uploaded to Netlify CDN
4. **Backend** → Docker container, deployed to Render
5. **Database** → Migrations run automatically
6. **Live** → Both services available to users

## SOLID Principles

### Single Responsibility Principle
- Controllers handle HTTP only
- Services handle business logic
- Repositories handle data access
- Validators handle input validation

### Open/Closed Principle
- Easily extend with new endpoints
- Add new services without modifying existing
- New components without affecting current ones

### Liskov Substitution Principle
- All repositories implement same interface
- Easy to mock for testing
- Can swap implementations

### Interface Segregation Principle
- Specific props interfaces for components
- Specific query parameters for endpoints
- Narrow service method signatures

### Dependency Inversion Principle
- Services depend on abstractions (repositories)
- Components depend on hook interfaces
- Not tightly coupled to implementations

## Testing Strategy

### Unit Tests
- Service logic
- Utility functions
- Custom hooks

### Integration Tests
- API endpoints
- Database operations
- Form submissions

### E2E Tests
- Complete user flows
- Cross-browser testing
- Production simulation

## Monitoring & Observability

### Logging
- Morgan for HTTP request logging
- Structured logs in production
- Error tracking (Sentry optional)

### Metrics
- API response times
- Database query performance
- Frontend bundle size
- User engagement

### Alerts
- Failed deployments
- Error rate spikes
- Performance degradation
- Database connection issues

## Future Enhancements

### Authentication
- Add user accounts
- JWT tokens
- Session management
- Role-based access control

### Real-time Features
- WebSocket for live updates
- Collaborative editing
- Notifications

### Advanced Queries
- Full-text search
- Advanced filtering
- Sorting options
- Export to CSV/PDF

### Performance
- Database connection pooling
- Query optimization
- Caching layer (Redis)
- CDN for static assets

## Conclusion

This architecture provides:
- ✅ Clear separation of concerns
- ✅ Type safety across the stack
- ✅ Easy to understand and maintain
- ✅ Scalable for teams
- ✅ Production-ready from day one
- ✅ Easy to test and debug
