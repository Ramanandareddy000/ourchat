import axiosInstance from '../api/axiosInstance';
import { User } from '../services/authService';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

export const getUserProfile = async (): Promise<UserProfile> => {
  try {
    const response = await axiosInstance.get<UserProfile>('/api/profile');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch profile');
  }
};

export const updateUserProfile = async (userData: Partial<UserProfile>): Promise<UserProfile> => {
  try {
    const response = await axiosInstance.put<UserProfile>('/api/profile', userData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update profile');
  }
};

export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await axiosInstance.get<User[]>('/api/users');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch users');
  }
};