import axiosInstance from '../api/axiosInstance';

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export class BaseService {
  protected basePath: string;

  constructor(basePath: string) {
    this.basePath = basePath;
  }

  // Generic GET request
  async fetchData<T>(endpoint: string = ''): Promise<ApiResponse<T>> {
    try {
      const response = await axiosInstance.get<ApiResponse<T>>(`${this.basePath}${endpoint}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch data');
    }
  }

  // Generic POST request
  async createData<T>(data: Partial<T>, endpoint: string = ''): Promise<ApiResponse<T>> {
    try {
      const response = await axiosInstance.post<ApiResponse<T>>(`${this.basePath}${endpoint}`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create data');
    }
  }

  // Generic PUT request
  async updateData<T>(id: string | number, data: Partial<T>, endpoint: string = ''): Promise<ApiResponse<T>> {
    try {
      const response = await axiosInstance.put<ApiResponse<T>>(`${this.basePath}${endpoint}/${id}`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update data');
    }
  }

  // Generic DELETE request
  async deleteData<T>(id: string | number, endpoint: string = ''): Promise<ApiResponse<T>> {
    try {
      const response = await axiosInstance.delete<ApiResponse<T>>(`${this.basePath}${endpoint}/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete data');
    }
  }

  // Get paginated data
  async fetchPaginatedData<T>(
    page: number = 1,
    limit: number = 10,
    endpoint: string = ''
  ): Promise<PaginatedResponse<T>> {
    try {
      const response = await axiosInstance.get<PaginatedResponse<T>>(
        `${this.basePath}${endpoint}?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch paginated data');
    }
  }
}