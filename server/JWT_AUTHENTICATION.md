# JWT Authentication Implementation

This document explains how JWT (JSON Web Token) authentication is implemented in this NestJS application.

## Installation

The following packages were added to implement JWT authentication:

```bash
npm install jsonwebtoken @types/jsonwebtoken
```

## Components

### 1. JwtService (`src/users/jwt.service.ts`)

This service handles JWT token generation and verification:

- `generateToken(user)`: Creates a JWT token for a user
- `verifyToken(token)`: Verifies a JWT token and returns its payload

### 2. AuthController (`src/users/auth.controller.ts`)

This controller handles authentication endpoints:

- `POST /auth/login`: Authenticates a user and returns a JWT token
- `POST /auth/register`: Registers a new user and returns a JWT token

### 3. AuthGuard (`src/users/auth.guard.ts`)

This guard protects routes by verifying JWT tokens:

- Extracts token from Authorization header
- Verifies token validity
- Attaches user object to request

### 4. ProfileController (`src/users/profile.controller.ts`)

This controller provides a protected endpoint to get user profile:

- `GET /auth/me`: Returns the authenticated user's profile

## Usage

### Login

To authenticate a user, send a POST request to `/auth/login`:

```json
{
  "username": "example_user",
  "password": "example_password"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "example_user",
    "displayName": "Example User",
    "avatarUrl": null
  }
}
```

### Register

To register a new user, send a POST request to `/auth/register`:

```json
{
  "username": "new_user",
  "password": "secure_password",
  "displayName": "New User"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 2,
    "username": "new_user",
    "displayName": "New User",
    "avatarUrl": null
  }
}
```

### Protected Routes

To access protected routes, include the JWT token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Get User Profile

To get the authenticated user's profile, send a GET request to `/auth/me` with the JWT token:

Response:
```json
{
  "user": {
    "id": 1,
    "username": "example_user",
    "displayName": "Example User",
    "avatarUrl": null
  }
}
```

## Configuration

The JWT implementation uses the following environment variables:

- `JWT_SECRET`: Secret key for signing JWT tokens (required)
- `JWT_EXPIRES_IN`: Token expiration time (default: "24h")

Make sure to set these in your `.env` file:

```
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=24h
```

## Security Considerations

1. Always use a strong, randomly generated `JWT_SECRET`
2. Use HTTPS in production to prevent token interception
3. Set appropriate token expiration times
4. Consider implementing refresh tokens for better security
5. Store tokens securely on the client side