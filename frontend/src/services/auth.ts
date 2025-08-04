import { apiClient } from './api';
import { API_ENDPOINTS } from '../utils/constants';
import { authStorage } from '../utils/storage';
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  RefreshTokenRequest,
  User,
} from '../types';

class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.LOGIN,
      credentials
    );

    // Store tokens and user data
    authStorage.setTokens(response.access_token, response.refresh_token);
    authStorage.setUser(response.user);

    return response;
  }

  async register(userData: RegisterRequest): Promise<{ message: string }> {
    return await apiClient.post<{ message: string }>(
      API_ENDPOINTS.REGISTER,
      userData
    );
  }

  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = authStorage.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const request: RefreshTokenRequest = { refresh_token: refreshToken };
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.REFRESH_TOKEN,
      request
    );

    // Update stored tokens
    authStorage.setTokens(response.access_token, response.refresh_token);
    authStorage.setUser(response.user);

    return response;
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.LOGOUT);
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout API call failed:', error);
    } finally {
      // Always clear local storage
      authStorage.clearAuth();
    }
  }

  async getProfile(): Promise<User> {
    return await apiClient.get<User>(API_ENDPOINTS.PROFILE);
  }

  async activateAccount(token: string): Promise<{ message: string }> {
    return await apiClient.get<{ message: string }>(
      `${API_ENDPOINTS.ACTIVATE}?token=${token}`
    );
  }

  getCurrentUser(): User | null {
    return authStorage.getUser();
  }

  isAuthenticated(): boolean {
    return authStorage.isAuthenticated();
  }
}

export const authService = new AuthService();
export default authService;