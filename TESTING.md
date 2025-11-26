# Testing Guide

## Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Setup environment:**
```bash
cp .env.example .env
```
Edit `.env` file:
```
DATABASE_URL=postgresql://username:password@localhost:5432/your_database
ACCESS_TOKEN_SECRET=your_super_secret_access_token_key_here
REFRESH_TOKEN_SECRET=your_super_secret_refresh_token_key_here
PORT=3000
```

3. **Run migrations:**
```bash
npm run migrate:up
```

4. **Start server:**
```bash
npm start
```

## Postman Testing

### Import Collection
1. Open Postman
2. Click Import
3. Select `postman-collection.json`
4. Collection will be imported with variables

### Test Flow

**1. Register Users:**
- Register User (role: user)
- Register Admin (role: admin)

**2. Login:**
- Login with user credentials → saves tokens automatically
- Login with admin credentials → saves tokens automatically

**3. Test User Endpoints:**
- Get Current User (any authenticated user)
- Get All Users (admin only)
- Get User by ID (admin only)
- Update User (admin only)
- Delete User (admin only)

**4. Test Token Refresh:**
- Use Refresh Token endpoint

### Manual Testing Examples

**Register:**
```
POST http://localhost:3000/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

**Login:**
```
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Get Current User:**
```
GET http://localhost:3000/users/me
Authorization: Bearer YOUR_ACCESS_TOKEN
```

## Expected Responses

**Successful Login:**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  },
  "accessToken": "eyJ...",
  "refreshToken": "eyJ..."
}
```

**Validation Error:**
```json
{
  "error": "\"email\" must be a valid email"
}
```

**Authorization Error:**
```json
{
  "error": "Insufficient permissions"
}
```