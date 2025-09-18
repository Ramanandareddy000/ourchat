import authService from '../../services/authService';

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

export const register = async (userData: CreateUserDto): Promise<User> => {
  try {
    const registerData = {
      username: userData.username,
      password: userData.password,
      displayName: userData.displayName || userData.username
    };
    
    const response = await authService.register(registerData);
    
    if (!response.success) {
      throw new Error(response.message || 'Registration failed');
    }
    
    // Store token in localStorage
    if ('token' in response && response.token) {
      localStorage.setItem('authToken', response.token);
    }
    
    // After registration, get the user profile
    const currentUser = await authService.getCurrentUser();
    if (currentUser) {
      return {
        id: parseInt(currentUser.id),
        username: currentUser.username,
        display_name: currentUser.displayName,
        avatar_url: userData.avatarUrl || '',
        image: undefined,
        online: true,
        last_seen: 'Online',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    } else {
      throw new Error('Failed to get user profile after registration');
    }
  } catch (error: any) {
    console.error('Registration error:', error);
    throw new Error(error.message || 'Registration failed');
  }
};

export const login = async (username: string, password: string): Promise<User> => {
  try {
    const loginData = {
      username: username,
      password: password
    };
    
    const response = await authService.login(loginData);
    
    if (!response.success) {
      throw new Error(response.message || 'Login failed');
    }
    
    // Store token in localStorage
    if ('token' in response && response.token) {
      localStorage.setItem('authToken', response.token);
    }
    
    // After login, get the user profile
    const currentUser = await authService.getCurrentUser();
    if (currentUser) {
      return {
        id: parseInt(currentUser.id),
        username: currentUser.username,
        display_name: currentUser.displayName,
        avatar_url: '',
        image: undefined,
        online: true,
        last_seen: 'Online',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    } else {
      throw new Error('Failed to get user profile after login');
    }
  } catch (error: any) {
    console.error('Login error:', error);
    // Remove token if login failed
    localStorage.removeItem('authToken');
    throw new Error(error.message || 'Login failed');
  }
};

export const logout = (): void => {
  authService.logout();
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    if (!authService.isAuthenticated()) {
      return null;
    }
    
    const currentUser = await authService.getCurrentUser();
    if (currentUser) {
      return {
        id: parseInt(currentUser.id),
        username: currentUser.username,
        display_name: currentUser.displayName,
        avatar_url: '',
        image: undefined,
        online: true,
        last_seen: 'Online',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
    return null;
  } catch (error: any) {
    console.error('Get current user error:', error);
    // If token is invalid or expired, remove it
    if (error.response?.status === 401) {
      authService.logout();
    }
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  return authService.isAuthenticated();
};