# API Testing with HTTP Files

This directory contains comprehensive HTTP test files for all API endpoints in the OursChat application.

## Setup

1. Make sure the server is running on `http://localhost:3002`
2. Use VS Code with the REST Client extension for the best experience
3. Update the `@baseUrl` variable if your server runs on a different port

## Test Files Organization

- `01-app.http` - Application health check
- `02-auth.http` - Authentication endpoints (register, login)
- `03-users.http` - User management endpoints
- `04-profile.http` - User profile endpoints (requires authentication)
- `05-messages.http` - Message management endpoints
- `06-chat.http` - Chat operations (send messages, add participants)
- `99-cleanup.http` - Cleanup test data

## Environment Variables

The files use these variables:
- `@baseUrl` - Server base URL (default: http://localhost:3002/api)
- `@token` - JWT token (obtained from login response)
- `@userId` - Test user ID
- `@chatId` - Test chat/conversation ID

## Usage

1. Run tests in order (01, 02, 03, etc.)
2. Copy tokens from login responses and update `@token` variable
3. Update user IDs and chat IDs as needed
4. Some tests depend on data created by previous tests