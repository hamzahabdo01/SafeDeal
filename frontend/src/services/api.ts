import axios, { AxiosError } from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import { toast } from 'react-hot-toast';
import { API_BASE_URL, ERROR_MESSAGES } from '../utils/constants';
import { authStorage } from '../utils/storage';
import type { ApiResponse, ApiError } from '../types';

class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (reason?: any) => void;
  }> = [];

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = authStorage.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && originalRequest && !(originalRequest as any)._retry) {
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            }).then(() => {
              return this.client(originalRequest);
            }).catch(err => {
              return Promise.reject(err);
            });
          }

          (originalRequest as any)._retry = true;
          this.isRefreshing = true;

          try {
            const refreshToken = authStorage.getRefreshToken();
            if (!refreshToken) {
              throw new Error('No refresh token available');
            }

            const response = await this.client.post('/refresh-token', {
              refresh_token: refreshToken,
            });

            const { access_token, refresh_token: newRefreshToken } = response.data;
            authStorage.setTokens(access_token, newRefreshToken);

            this.processQueue(null, access_token);
            return this.client(originalRequest);
          } catch (refreshError) {
            this.processQueue(refreshError, null);
            authStorage.clearAuth();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private processQueue(error: any, token: string | null): void {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });

    this.failedQueue = [];
  }

  // HTTP Methods
  async get<T>(url: string, params?: any): Promise<T> {
    try {
      const response = await this.client.get<ApiResponse<T>>(url, { params });
      return (response.data.data || response.data) as T;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async post<T>(url: string, data?: any): Promise<T> {
    try {
      const response = await this.client.post<ApiResponse<T>>(url, data);
      return (response.data.data || response.data) as T;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async put<T>(url: string, data?: any): Promise<T> {
    try {
      const response = await this.client.put<ApiResponse<T>>(url, data);
      return (response.data.data || response.data) as T;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async delete<T>(url: string): Promise<T> {
    try {
      const response = await this.client.delete<ApiResponse<T>>(url);
      return (response.data.data || response.data) as T;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: unknown): Error {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiError>;
      
      // Network error
      if (!axiosError.response) {
        toast.error(ERROR_MESSAGES.NETWORK_ERROR);
        return new Error(ERROR_MESSAGES.NETWORK_ERROR);
      }

      // HTTP error responses
      const { status, data } = axiosError.response;
      const errorMessage = data?.error || data?.message || this.getStatusMessage(status);

      // Don't show toast for 401 errors (handled by interceptor)
      if (status !== 401) {
        toast.error(errorMessage);
      }

      return new Error(errorMessage);
    }

    // Unknown error
    const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.UNKNOWN_ERROR;
    toast.error(errorMessage);
    return new Error(errorMessage);
  }

  private getStatusMessage(status: number): string {
    switch (status) {
      case 400:
        return ERROR_MESSAGES.VALIDATION_ERROR;
      case 401:
        return ERROR_MESSAGES.UNAUTHORIZED;
      case 403:
        return ERROR_MESSAGES.FORBIDDEN;
      case 404:
        return ERROR_MESSAGES.NOT_FOUND;
      case 500:
      case 502:
      case 503:
      case 504:
        return ERROR_MESSAGES.SERVER_ERROR;
      default:
        return ERROR_MESSAGES.UNKNOWN_ERROR;
    }
  }
}

// Create and export singleton instance
export const apiClient = new ApiClient();
export default apiClient;