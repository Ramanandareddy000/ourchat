# OursChat API Endpoints Documentation

Base URL: `http://localhost:3002/api`

## 📱 Application

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET    | `/`      | Health check / Hello message | No |

## 🔐 Authentication

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST   | `/auth/register` | Register new user | `{username, password, displayName}` | `{token, user}` |
| POST   | `/auth/login` | Login user | `{username, password}` | `{token, user}` |

### Example Requests:

```json
// Register
{
  "username": "newuser",
  "password": "securepassword123",
  "displayName": "New User"
}

// Login
{
  "username": "raja",
  "password": "10062003"
}
```

## 👤 User Management

| Method | Endpoint | Description | Auth Required | Request Body |
|--------|----------|-------------|---------------|--------------|
| POST   | `/users` | Create new user | No | `{username, password, displayName, avatarUrl?}` |
| GET    | `/users` | Get all users | No | - |
| GET    | `/users/:id` | Get user by ID | No | - |
| PUT    | `/users/:id` | Update user | No | `{displayName?, avatarUrl?, ...}` |
| DELETE | `/users/:id` | Delete user | No | - |

## 👔 Profile

| Method | Endpoint | Description | Auth Required | Headers |
|--------|----------|-------------|---------------|---------|
| GET    | `/profile/me` | Get current user profile | Yes | `Authorization: Bearer <token>` |

## 💬 Messages

| Method | Endpoint | Description | Auth Required | Request Body |
|--------|----------|-------------|---------------|--------------|
| POST   | `/messages` | Create message directly | No | `{conversation_id, sender_id, text}` |
| GET    | `/messages` | Get all messages | No | - |
| GET    | `/messages/:id` | Get message by ID | No | - |
| GET    | `/messages/user/:userId` | Get messages by user | No | - |
| GET    | `/messages/user/:userId/conversations` | Get user conversations | No | - |
| GET    | `/messages/conversation/:conversationId` | Get messages by conversation | No | - |
| PUT    | `/messages/:id` | Update message | No | `{text}` |
| DELETE | `/messages/:id` | Delete message | No | - |

## 💬 Chat Operations

| Method | Endpoint | Description | Auth Required | Request Body |
|--------|----------|-------------|---------------|--------------|
| POST   | `/messages/send` | Send message (smart routing) | No | `{sender_id, content, receiver_id?, conversation_id?}` |
| POST   | `/chat/participants` | Add participant to chat | No | `{chat_id, user_id?, username?}` |

### Message Sending Examples:

```json
// Direct message (1:1 chat)
{
  "sender_id": 13,
  "receiver_id": 1,
  "content": "Hello! This is a direct message."
}

// Group message (existing conversation)
{
  "sender_id": 13,
  "conversation_id": 111,
  "content": "Hello everyone! This is a group message."
}
```

### Add Participant Examples:

```json
// Add by user ID
{
  "chat_id": 111,
  "user_id": 8
}

// Add by username
{
  "chat_id": 111,
  "username": "raju"
}
```

## 📊 Response Formats

### Success Responses

```json
// Authentication responses
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "username": "raja",
    "display_name": "Raja Kumar",
    "avatar_url": null
  }
}

// Message send success
{
  "success": true,
  "message": {
    "message_id": 245,
    "sender_id": 13,
    "receiver_id": 1,
    "content": "Hello! This is a direct message.",
    "timestamp": "2025-09-18T18:53:51.645Z",
    "conversation_id": 103
  }
}

// General data responses
{
  "data": [...],
  "success": true
}
```

### Error Responses

```json
// Validation errors (400)
{
  "statusCode": 400,
  "message": "Message content cannot be empty",
  "error": "Bad Request"
}

// Business logic errors (200 with error flag)
{
  "success": false,
  "error": "Sender does not exist."
}

// Authentication errors (401)
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}

// Not found errors (404)
{
  "statusCode": 404,
  "message": "User not found",
  "error": "Not Found"
}
```

## 🔥 Status Codes

| Code | Description | When |
|------|-------------|------|
| 200  | OK | Successful GET requests, some POST operations |
| 201  | Created | Successful POST requests (user creation, messages) |
| 204  | No Content | Successful DELETE requests |
| 400  | Bad Request | Validation errors, malformed requests |
| 401  | Unauthorized | Missing or invalid authentication |
| 404  | Not Found | Resource doesn't exist |
| 500  | Internal Server Error | Unexpected server errors |

## 🛡️ Authentication

- JWT tokens are returned from `/auth/login` and `/auth/register`
- Include token in Authorization header: `Authorization: Bearer <token>`
- Only `/profile/me` currently requires authentication
- Tokens contain: `{userId, username, iat, exp}`

## ⚠️ Validation Rules

### User Data
- Username: Required, unique
- Password: Minimum length enforced
- Display name: Required for registration

### Messages
- Content: Required, max 10,000 characters, trimmed
- Sender ID: Must exist in users table
- Receiver ID: Must exist in users table (for direct messages)
- Conversation ID: Must exist (for group messages)
- Either receiver_id OR conversation_id required

### Chat Participants
- Chat ID: Must be valid conversation ID
- Either user_id OR username required
- User must exist
- No duplicate participants allowed

## 🧪 Testing

1. Use the provided `.http` files with VS Code REST Client extension
2. Run the automated test script: `./run-tests.sh`
3. Update environment variables in `http-client.env.json`
4. Start with authentication tests to get valid tokens