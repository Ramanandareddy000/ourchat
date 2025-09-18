import { User } from '../services/authService';
import { BaseService } from './BaseService';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

class UserService extends BaseService {
  constructor() {
    super('/api');
  }

  async getUserProfile(): Promise<UserProfile> {
    const response = await this.fetchData<UserProfile>('/profile');
    return response.data;
  }

  async updateUserProfile(userData: Partial<UserProfile>): Promise<UserProfile> {
    const response = await this.updateData('', userData, '/profile');
    return response.data;
  }

  async getUsers(): Promise<User[]> {
    const response = await this.fetchData<User[]>('/users');
    return response.data;
  }
}

// Export a singleton instance
export const userService = new UserService();
export default userService;