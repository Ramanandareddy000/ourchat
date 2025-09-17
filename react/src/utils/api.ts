// API service for user registration
const IS_DEV = import.meta.env.DEV || false;
const API_BASE_URL = IS_DEV ? '/api' : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002'); // Use proxy in dev, direct URL in prod

import { User } from '../types';

export interface CreateUserDto {
  username: string;
  password: string;
  displayName: string;
  avatarUrl?: string;
}

export const registerUser = async (userData: CreateUserDto): Promise<User> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: userData.username,
        password: userData.password,
        displayName: userData.displayName,
        avatarUrl: userData.avatarUrl || undefined,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }

    const user: User = await response.json();
    return user;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};