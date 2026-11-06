import { apiClient } from './api';
import {
  UserLogin,
  UserRegister,
  TokenResponse,
  UserResponse,
  UserUpdateProfile,
  UserChangePassword,
} from '@/types/auth';

export const authService = {
  // Login ke akun
  async login(payload: UserLogin): Promise<TokenResponse> {
    const response = await apiClient.post<TokenResponse>('/auth/login', payload);
    return response.data;
  },

  async deleteAccount(payload: { password: string }): Promise<void> {
    await apiClient.post('/auth/delete-account', payload);
  },

  // Mendaftar akun baru
  async register(payload: UserRegister): Promise<TokenResponse> {
    const response = await apiClient.post<TokenResponse>('/auth/register', payload);
    return response.data;
  },

  // Mengambil profil pengguna yang sedang login (membutuhkan Bearer token)
  async getMe(): Promise<UserResponse> {
    const response = await apiClient.get<UserResponse>('/auth/me');
    return response.data;
  },

  // Memperbarui data profil
  async updateProfile(payload: UserUpdateProfile): Promise<UserResponse> {
    const response = await apiClient.put<UserResponse>('/auth/me', payload);
    return response.data;
  },

  // Mengubah kata sandi
  async changePassword(payload: UserChangePassword): Promise<{ message: string }> {
    const response = await apiClient.put<{ message: string }>('/auth/change-password', payload);
    return response.data;
  },
};
