# 📋 API Endpoints Overview

Here's a comprehensive guide to the endpoints available in my API:

## 🔐 Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login and get access token |
| `POST` | `/api/auth/logout` | Logout (invalidate token) |
| `GET`  | `/api/auth/token/:userId` | Get token information by user ID |

## 👤 Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/users` | Get all users |
| `GET` | `/api/users/:id` | Get user by ID |
| `PUT` | `/api/users/:id` | Update user |
| `DELETE` | `/api/users/:id` | Delete user |

## ✅ Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/tasks` | Get all tasks |
| `GET` | `/api/tasks?mine=true` | Get only current user's tasks |
| `GET` | `/api/tasks/:id` | Get task by ID |
| `GET` | `/api/tasks/:id?comments=true` | Get task with comments |
| `POST` | `/api/tasks` | Create a new task |
| `PUT` | `/api/tasks/:id` | Update task |
| `DELETE` | `/api/tasks/:id` | Delete task |

## 💬 Comments

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/comments/task/:taskId` | Get comments for a task |
| `POST` | `/api/comments/task/:taskId` | Add comment to a task |
| `PUT` | `/api/comments/:id` | Update comment |
| `DELETE` | `/api/comments/:id` | Delete comment |

> **Note:** All endpoints except `/api/auth/register` and `/api/auth/login` require authentication with a bearer token in the Authorization header.

## 🐳 Running the Database

This project uses PostgreSQL as the database, which is containerized using Docker. To run the database:

1. Make sure you have Docker and Docker Compose installed on your system
2. Navigate to the project root directory
3. Run the following command to start the database container:

```bash
docker-compose up -d
```

This will start:
- PostgreSQL database on port 5432
- pgAdmin web interface on port 5050 (accessible at http://localhost:5050)

### Database Credentials

| Service | Username | Password |
|---------|----------|----------|
| PostgreSQL | admin | admin |
| pgAdmin | admin@example.com | admin123 |

To stop the database:

```bash
docker-compose down
```

To stop and remove all data volumes:

```bash
docker-compose down -v
```

