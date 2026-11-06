import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Kunci penyimpanan token di AsyncStorage
export const TOKEN_STORAGE_KEY = '@fingenius_auth_token';

// Deteksi Base URL otomatis berdasarkan platform perangkat:
// - Android Emulator: 10.0.2.2 adalah alias IP host machine
// - iOS Simulator / Web: localhost
// - Perangkat Fisik (Expo Go): Dapat di-override via env EXPO_PUBLIC_API_URL (misal: http://192.168.1.5:8000/api/v1)
const DEFAULT_BASE_URL = Platform.select({
  android: 'http://10.0.2.2:8000/api/v1',
  default: 'http://localhost:8000/api/v1',
});

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || DEFAULT_BASE_URL;

// Instance Axios Terpusat
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request Interceptor: Otomatis menyematkan Authorization Bearer Token jika tersedia
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn('Gagal membaca auth token dari storage', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Callback saat sesi pengguna berakhir (401 Unauthorized)
type UnauthorizedCallback = () => void;
let onUnauthorizedCallback: UnauthorizedCallback | null = null;

export const setOnUnauthorizedCallback = (callback: UnauthorizedCallback | null) => {
  onUnauthorizedCallback = callback;
};

// Response Interceptor: Menangani format error dari FastAPI (error.response.data.detail)
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ detail?: string | any[] }>) => {
    if (error.response) {
      // 401 Unauthorized: Sesi habis / token tidak valid (kecuali saat proses login gagal)
      if (error.response.status === 401) {
        const isLoginRequest = error.config?.url?.includes('/auth/login');
        if (!isLoginRequest) {
          await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
          if (onUnauthorizedCallback) {
            onUnauthorizedCallback();
          }
        }
      }

      // Ambil pesan error ramah dari backend FastAPI
      const detail = error.response.data?.detail;
      if (typeof detail === 'string') {
        error.message = detail;
      } else if (Array.isArray(detail) && detail.length > 0 && detail[0].msg) {
        error.message = detail[0].msg;
      }
    } else if (error.request) {
      error.message = 'Tidak dapat terhubung ke server backend. Pastikan Docker & Backend aktif.';
    }
    return Promise.reject(error);
  }
);
