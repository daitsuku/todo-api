# 📋 API Endpoints Overview

Here's a comprehensive guide to the endpoints available in my API:

## ⚠️ Production Warning

> **IMPORTANT**: This setup is intended for development and testing purposes only. For production environments, you should:
> - Use strong, unique passwords and JWT secrets
> - Configure proper environment-specific settings
> - Implement additional security measures
> - Consider using a managed database service instead of Docker containers
> - Set up proper logging, monitoring, and backup solutions
> - Use HTTPS with valid SSL certificates

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

## 🔄 Database Migrations and Seeding

This project uses Prisma ORM for database management. Here's how to work with the database:

### Running Migrations

To apply all pending migrations to your database:

```bash
npm run migrate
```

This command runs `prisma migrate dev` which will:
1. Apply any pending migrations
2. Generate the Prisma client
3. Create a new migration if you've made changes to your schema

### Seeding the Database

To populate your database with initial data:

```bash
npm run seed
```

This runs the seed script located at `prisma/seed.ts` which creates sample users, tasks, and comments.


## ⚙️ Environment Variables

The application requires the following environment variables in a `.env` file at the root of the project:

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://yourusername:yourpassword@yourhost:port/yourdb?schema=yourschema` |
| `PORT` | Port for the server to listen on | `3000 or your desire port` |
| `JWT_SECRET` | Secret key for JWT token generation | `somerandomhashidk` |
| `TOKEN_EXPIRY` | JWT token expiration time | `24h or whatever you like` |

the default is in `src/config/environment.ts` anyways, excluding the `DATABASE_URL`.

Please make sure to create `.env` file before starting the application.

This APIs is made for [my todo app](https://github.com/daitsuku/todo-app). Make sure to check it out!
