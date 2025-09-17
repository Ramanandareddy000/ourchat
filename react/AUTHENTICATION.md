# Authentication Implementation

This project implements token-based authentication using JWT and Axios for API communication.

## Structure

- `src/api/` - Contains the Axios instance with interceptors
- `src/services/` - Contains authentication and other API services
- `src/components/` - Contains Login and ProtectedRoute components
- `src/hooks/` - Contains custom hooks like useAuth
- `src/utils/` - Contains utility functions for authentication

## Usage

### Authentication Service

The authentication service provides methods for login, registration, and user management:

```typescript
import { login, register, logout, getCurrentUser } from './services/authService';

// Login
const result = await login({ email, password });

// Register
const result = await register({ name, email, password });

// Logout
logout();

// Get current user
const user = await getCurrentUser();
```

### Protected Routes

Use the ProtectedRoute component to protect routes that require authentication:

```jsx
import ProtectedRoute from './components/ProtectedRoute';

<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />
```

### API Services

Create services for different API endpoints:

```typescript
import axiosInstance from '../api/axiosInstance';

export const getUserProfile = async () => {
  const response = await axiosInstance.get('/api/profile');
  return response.data;
};
```

### Authentication Hook

Use the useAuth hook to access authentication state in components:

```jsx
import { useAuth } from './hooks/useAuth';

const MyComponent = () => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please login</div>;
  
  return <div>Hello, {user.name}!</div>;
};
```

## Environment Variables

Make sure to set the following environment variables in your `.env` file:

```
VITE_API_BASE_URL=http://localhost:3000
VITE_JWT_SECRET=your-jwt-secret-key
```