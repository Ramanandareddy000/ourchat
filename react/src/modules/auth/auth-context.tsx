import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../../types';
import * as authService from './auth-service';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: { username: string; password: string; displayName: string; avatarUrl?: string }) => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const initAuth = async () => {
      if (authService.isAuthenticated()) {
        try {
          const currentUser = await authService.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
          } else {
            // Token might be invalid, clear it
            authService.logout();
          }
        } catch (err) {
          console.error('Failed to get current user', err);
          authService.logout();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const userData = await authService.login(username, password);
      setUser(userData);
      // Use setTimeout to ensure state is updated before navigation
      setTimeout(() => {
        navigate('/');
      }, 0);
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    authService.logout();
    // Redirect to login page after logout
    navigate('/login');
  };

  const register = async (userData: { username: string; password: string; displayName: string; avatarUrl?: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      // Register the user
      const registeredUser = await authService.register(userData);
      setUser(registeredUser);
      // Use setTimeout to ensure state is updated before navigation
      setTimeout(() => {
        navigate('/');
      }, 0);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    login,
    logout,
    register,
    isAuthenticated: !!user,
    isLoading,
    error
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};