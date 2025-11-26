# Express Auth API

A complete Node.js Express backend with PostgreSQL for user management, authentication, and role-based authorization.

## Features

- User registration and authentication
- JWT-based access and refresh tokens
- Role-based authorization (user/admin)
- PostgreSQL database with raw SQL queries
- RESTful API endpoints
- Password hashing with bcrypt

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```
Edit `.env` with your database URL and JWT secrets.

3. Run database migrations:
```bash
npm run migrate:up
```

4. Start the server:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/refresh` - Refresh access token

### Users
- `GET /users/me` - Get current user profile (authenticated)
- `GET /users` - Get all users (admin only)
- `GET /users/:id` - Get specific user (admin only)
- `PATCH /users/:id` - Update user (admin only)
- `DELETE /users/:id` - Delete user (admin only)

## Database Schema

The `users` table includes:
- `id` (SERIAL PRIMARY KEY)
- `name` (VARCHAR)
- `email` (VARCHAR, UNIQUE)
- `password` (TEXT, bcrypt hash)
- `role` (VARCHAR, 'user' or 'admin')
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP, auto-updated)

## Authentication Flow

1. Register/Login to get access and refresh tokens
2. Include access token in Authorization header: `Bearer <token>`
3. Use refresh token to get new access token when expired
4. Admin role required for user management endpoints