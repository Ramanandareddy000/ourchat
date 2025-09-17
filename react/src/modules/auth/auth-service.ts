import axiosInstance from '../../api/axiosInstance';

interface CreateUserDto {
  username: string;
  password: string;
  displayName: string;
  avatarUrl?: string;
}

interface User {
  id: number;
  username: string;
  display_name: string;
  avatar_url: string;
  image?: string;
  online: boolean;
  last_seen: string;
  phone?: string;
  about?: string;
  is_group?: boolean;
  created_at: string;
  updated_at: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

export const register = async (userData: CreateUserDto): Promise<User> => {
  try {
    const response = await axiosInstance.post<AuthResponse>('/auth/register', {
      username: userData.username,
      password: userData.password,
      displayName: userData.displayName,
      avatarUrl: userData.avatarUrl || undefined,
    });

    const { token, user } = response.data;
    
    // Store token in localStorage
    localStorage.setItem('authToken', token);
    
    return user;
  } catch (error: any) {
    console.error('Registration error:', error);
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

export const login = async (username: string, password: string): Promise<User> => {
  try {
    const response = await axiosInstance.post<AuthResponse>('/auth/login', {
      username,
      password
    });

    const { token, user } = response.data;
    
    // Store token in localStorage
    localStorage.setItem('authToken', token);
    
    // Return user with online status
    return {
      ...user,
      online: true,
      last_seen: 'Online'
    };
  } catch (error: any) {
    console.error('Login error:', error);
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const logout = (): void => {
  localStorage.removeItem('authToken');
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      return null;
    }
    
    const response = await axiosInstance.get<{ user: User }>('/auth/me');
    return response.data.user;
  } catch (error) {
    console.error('Get current user error:', error);
    // If token is invalid, remove it
    localStorage.removeItem('authToken');
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('authToken');
  return !!token;
};