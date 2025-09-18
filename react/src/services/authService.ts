import axiosInstance from '../api/axiosInstance';
import { BaseService } from './BaseService';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  password: string;
  displayName: string;
}

export interface User {
  id: number;
  username: string;
  displayName: string;
}

export interface AuthResponse {
  token: string;
  user?: User;
}

class AuthService extends BaseService {
  constructor() {
    super('/auth');
  }

  async login(credentials: LoginCredentials): Promise<{ success: boolean; user?: User; token?: string; message?: string }> {
    try {
      const loginData = {
        username: credentials.username,
        password: credentials.password
      };
      
      const response = await axiosInstance.post<AuthResponse>('/auth/login', loginData);
      const { token, user } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('authToken', token);
      
      return { 
        success: true, 
        user: user ? {
          id: typeof user.id === 'string' ? parseInt(user.id, 10) : user.id,
          username: user.username || loginData.username,
          displayName: user.displayName || user.username || loginData.username
        } : undefined,
        token 
      };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  }

  async register(userData: RegisterData): Promise<{ success: boolean; user?: User; token?: string; message?: string }> {
    try {
      // Transform the data to match what the backend expects
      const registerData = {
        username: userData.username,
        password: userData.password,
        displayName: userData.displayName || userData.username
      };
      
      const response = await axiosInstance.post<AuthResponse>('/auth/register', registerData);
      const { token, user } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('authToken', token);
      
      return { 
        success: true, 
        user: user ? {
          id: typeof user.id === 'string' ? parseInt(user.id, 10) : user.id,
          username: user.username || registerData.username,
          displayName: user.displayName || user.username || registerData.username
        } : undefined,
        token 
      };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  }

  logout(): void {
    localStorage.removeItem('authToken');
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await axiosInstance.get<{ user: any }>('/profile/me');
      const userData = response.data.user;
      return {
        id: typeof userData.id === 'string' ? parseInt(userData.id, 10) : userData.id,
        username: userData.username,
        displayName: userData.displayName || userData.display_name || userData.username
      };
    } catch (error) {
      return null;
    }
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    return !!token;
  }
}

// Export a singleton instance
const authService = new AuthService();
export default authService;