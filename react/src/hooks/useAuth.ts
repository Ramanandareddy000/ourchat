import { useState, useEffect } from 'react';
import authService from '../services/authService';
import { User } from '../services/authService';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (authService.isAuthenticated()) {
        try {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        } catch (error) {
          // If token is invalid, remove it
          localStorage.removeItem('authToken');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  return { user, loading };
};