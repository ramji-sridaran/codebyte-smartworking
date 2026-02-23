# Task Management App

A simple full-stack task management application built with Spring Boot and React.

## Quick Start

### Prerequisites
- Java 17+
- Node.js 18+
- Maven 3.8+

### Run the Backend
```bash
cd backend
mvn spring-boot:run
```
Backend runs at http://localhost:8080

### Run the Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at http://localhost:3000

### Run Tests
```bash
# Backend tests
cd backend && mvn test

# Frontend tests
cd frontend && npm test
```

---

## What's Built

### Backend (Spring Boot)
- REST API for task CRUD operations
- H2 in-memory database
- Validation, error handling, pagination
- Swagger docs at `/swagger-ui.html`

### Frontend (React + TypeScript)
- Task list with search, filter, sort
- Create/edit task forms
- Toggle completion status
- Responsive design

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/tasks` | Get all tasks (paginated) |
| GET | `/api/v1/tasks/{id}` | Get single task |
| POST | `/api/v1/tasks` | Create task |
| PUT | `/api/v1/tasks/{id}` | Update task |
| PATCH | `/api/v1/tasks/{id}/toggle-status` | Toggle completion |
| DELETE | `/api/v1/tasks/{id}` | Delete task |
| GET | `/api/v1/tasks/status?isCompleted=true` | Filter by status |
| GET | `/api/v1/tasks/search?title=keyword` | Search by title |

Query params: `page`, `size`, `sortBy`, `sortDirection`

---

## Project Structure

```
├── backend/
│   └── src/main/java/com/codebyte/taskmanagement/
│       ├── controller/    # REST endpoints
│       ├── service/       # Business logic
│       ├── repository/    # Data access
│       ├── entity/        # Task model
│       ├── dto/           # Request/response objects
│       └── exception/     # Error handling
│
└── frontend/src/
    ├── components/        # UI components
    ├── context/           # State management
    ├── services/          # API client
    └── tests/             # Unit & E2E tests
```

---

## Architecture Decisions

**Why H2?** Quick setup, no external DB needed. Easy to swap for PostgreSQL in production.

**Why Context API?** App is small enough that Redux would be overkill. Context handles state cleanly.

**Why no Lombok?** Had Java 17 compatibility issues. Used manual getters/setters instead — more explicit anyway.

---

## Production Considerations

### Scalability
- Add Redis caching for frequently accessed tasks
- Database connection pooling (HikariCP already included)
- Horizontal scaling via stateless API design

### Security
- Add JWT authentication
- Enable HTTPS
- Rate limiting on API endpoints
- Input sanitization (already handled by Spring validation)

### Deployment
- Dockerize both services
- Use environment variables for config
- Set up CI/CD pipeline
- Add health check endpoints

---

## AI Usage

This project was built with GitHub Copilot assistance for:
- Boilerplate code generation
- Test scaffolding
- Documentation drafting

All code was reviewed and validated manually.

---

## What I'd Add With More Time

- User authentication
- Task categories/tags
- Due date reminders
- Dark mode
- More comprehensive E2E tests

