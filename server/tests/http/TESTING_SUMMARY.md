# 🧪 OursChat API Testing Suite

## 📁 Directory Structure

```
tests/http/
├── README.md                 # Setup and usage instructions
├── API_ENDPOINTS.md          # Complete API documentation
├── TESTING_SUMMARY.md        # This file
├── http-client.env.json      # Environment variables for VS Code REST Client
├── run-tests.sh              # Automated test script
├── 01-app.http              # Application health check
├── 02-auth.http             # Authentication endpoints
├── 03-users.http            # User management
├── 04-profile.http          # Profile endpoints (auth required)
├── 05-messages.http         # Message management
├── 06-chat.http             # Chat operations (send messages, participants)
└── 99-cleanup.http          # Cleanup test data
```

## 🚀 How to Run Tests

### Method 1: VS Code REST Client (Recommended)
1. Install "REST Client" extension in VS Code
2. Open any `.http` file
3. Click "Send Request" above each request
4. Variables are auto-loaded from `http-client.env.json`

### Method 2: Automated Script
```bash
cd tests/http
chmod +x run-tests.sh
./run-tests.sh
```

### Method 3: Manual curl Commands
```bash
# Health check
curl -s http://localhost:3002/api/

# Login to get token
curl -X POST http://localhost:3002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "raja", "password": "password123"}'

# Send message
curl -X POST http://localhost:3002/api/messages/send \
  -H "Content-Type: application/json" \
  -d '{"sender_id": 13, "receiver_id": 1, "content": "Test message"}'
```

## 📋 Test Coverage

### ✅ Covered Endpoints

| Category | Endpoints | Status |
|----------|-----------|--------|
| **App** | GET `/` | ✅ |
| **Auth** | POST `/auth/login`, `/auth/register` | ✅ |
| **Users** | GET, POST, PUT, DELETE `/users` | ✅ |
| **Profile** | GET `/profile/me` (auth required) | ✅ |
| **Messages** | All CRUD operations | ✅ |
| **Chat** | Send messages, add participants | ✅ |

### 🧪 Test Scenarios

- ✅ Valid requests with expected responses
- ✅ Invalid data validation (400 errors)
- ✅ Authentication failures (401 errors)
- ✅ Resource not found (404 errors)
- ✅ Business logic errors (custom error messages)
- ✅ Edge cases (empty content, invalid IDs, etc.)

## 🔧 Environment Configuration

Update `http-client.env.json` with your test data:

```json
{
  "development": {
    "baseUrl": "http://localhost:3002/api",
    "testUserId": 13,
    "testSenderId": 13,
    "testReceiverId": 1,
    "testConversationId": 111,
    "token": "your_jwt_token_here"
  }
}
```

## 📊 Key Test Users (from current database)

| ID | Username | Display Name | Notes |
|----|----------|--------------|-------|
| 1  | alice_johnson | Alice Johnson | Active user |
| 13 | raja | ram | Test user for sending |
| 8  | raju | Raju Kumar | Test user for receiving |
| 21 | alex_morgan | Alex Morgan | Recent user |

## 🎯 Common Test Workflows

### 1. Authentication Flow
```
02-auth.http → Login → Copy token → 04-profile.http
```

### 2. Message Sending Flow
```
06-chat.http → Send direct message → Send group message → Check errors
```

### 3. User Management Flow
```
03-users.http → Create user → Get users → Update user → Delete user
```

## ⚠️ Important Notes

1. **Server Must Be Running**: Ensure `npm run start:dev` is running
2. **Database State**: Tests may create data; use 99-cleanup.http to clean up
3. **Token Expiry**: JWT tokens expire; get fresh tokens from login
4. **User Passwords**: Test users may not have passwords set for login tests
5. **IDs May Change**: Database IDs may change between test runs

## 🐛 Troubleshooting

### Common Issues:

1. **Connection Refused**
   - Check if server is running on port 3002
   - Run: `npm run start:dev` in server directory

2. **401 Unauthorized**
   - Token expired or invalid
   - Get new token from `/auth/login`

3. **404 Not Found**
   - Check endpoint URL
   - Verify resource IDs exist

4. **400 Bad Request**
   - Check request body format
   - Ensure required fields are provided

5. **Invalid Credentials**
   - Some test users may not have passwords
   - Create new test user or check existing credentials

## 📈 Test Results Format

All endpoints return consistent response formats:

```json
// Success (most endpoints)
{
  "data": {...},
  "success": true
}

// Success (auth endpoints)
{
  "token": "jwt_token",
  "user": {...}
}

// Success (chat operations)
{
  "success": true,
  "message": {...}
}

// Error (validation)
{
  "statusCode": 400,
  "message": "Validation error",
  "error": "Bad Request"
}

// Error (business logic)
{
  "success": false,
  "error": "Custom error message"
}
```

## 🔍 Debugging Tips

1. **Use VS Code REST Client**: Best experience with syntax highlighting
2. **Check Response Headers**: Look for status codes and content types
3. **Examine Full Response**: Don't just check success/error flags
4. **Test Edge Cases**: Empty strings, null values, invalid IDs
5. **Verify Database State**: Check if test data was actually created/modified

## 🎁 Bonus Features

- **Environment Variables**: Switch between development/production easily
- **Automated Testing**: Run all tests with one command
- **Comprehensive Documentation**: Every endpoint documented with examples
- **Error Scenarios**: Tests include failure cases, not just happy paths
- **Real Test Data**: Uses actual database IDs and realistic scenarios