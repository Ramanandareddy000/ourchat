import axiosInstance from '../api/axiosInstance';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const login = async (credentials: LoginCredentials): Promise<{ success: boolean; user?: User; token?: string; message?: string }> => {
  try {
    const response = await axiosInstance.post<AuthResponse>('/auth/login', credentials);
    const { token, user } = response.data;
    
    // Store token in localStorage
    localStorage.setItem('authToken', token);
    
    return { success: true, user, token };
  } catch (error: any) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Login failed' 
    };
  }
};

export const register = async (userData: RegisterData): Promise<{ success: boolean; user?: User; message?: string }> => {
  try {
    const response = await axiosInstance.post<{ user: User }>('/auth/register', userData);
    return { success: true, user: response.data.user };
  } catch (error: any) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Registration failed' 
    };
  }
};

export const logout = (): void => {
  localStorage.removeItem('authToken');
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const response = await axiosInstance.get<{ user: User }>('/auth/me');
    return response.data.user;
  } catch (error) {
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('authToken');
  return !!token;
};