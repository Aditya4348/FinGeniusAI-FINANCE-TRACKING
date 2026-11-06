import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';

import { authService } from '@/services/auth.service';
import { TOKEN_STORAGE_KEY, setOnUnauthorizedCallback } from '@/services/api';
import {
  UserLogin,
  UserRegister,
  UserResponse,
  UserUpdateProfile,
  TokenResponse,
} from '@/types/auth';
import { ToastAndroid, Platform } from 'react-native';

interface AuthContextType {
  user: UserResponse | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticating: boolean;
  isAuthenticated: boolean;
  login: (credentials: UserLogin) => Promise<TokenResponse>;
  register: (payload: UserRegister) => Promise<TokenResponse>;
  deleteAccount: (payload: { password: string }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (payload: UserUpdateProfile) => Promise<UserResponse>;
  refetchUser: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);

  // 1. Muat token yang tersimpan di AsyncStorage saat aplikasi pertama kali menyala
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
        if (storedToken) {
          setToken(storedToken);
        }
      } catch (error) {
        console.warn('Gagal memuat token autentikasi:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeAuth();
  }, []);

  // 2. Query TanStack untuk memuat profil pengguna aktif jika token tersedia
  const {
    data: user = null,
    isLoading: isUserLoading,
    isError: isUserError,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ['auth', 'me', token],
    queryFn: async () => {
      if (!token) return null;
      return await authService.getMe();
    },
    enabled: !!token,
    staleTime: 1000 * 60 * 5, // Cache valid selama 5 menit
    retry: 1,
  });

  // Jika token di storage tidak valid (misal sesi habis saat baru buka aplikasi), bersihkan token
  useEffect(() => {
    if (isUserError && token) {
      AsyncStorage.removeItem(TOKEN_STORAGE_KEY).catch(() => {});
      setToken(null);
    }
  }, [isUserError, token]);

  // Daftarkan listener 401 Unauthorized dari apiClient
  useEffect(() => {
    setOnUnauthorizedCallback(() => {
      setToken(null);
      queryClient.removeQueries({ queryKey: ['auth'] });
    });

    return () => {
      setOnUnauthorizedCallback(null);
    };
  }, [queryClient]);

  // 3. Mutasi Login
  const loginMutation = useMutation({
    mutationFn: (credentials: UserLogin) => authService.login(credentials),
    onSuccess: async (data) => {
      await AsyncStorage.setItem(TOKEN_STORAGE_KEY, data.access_token);
      setToken(data.access_token);
      queryClient.setQueryData(['auth', 'me', data.access_token], data.user);
      router.replace('/(tabs)');
    },
  });

  // 4. Mutasi Registrasi (otomatis auto-login karena backend mengembalikan TokenResponse)
  const registerMutation = useMutation({
    mutationFn: (payload: UserRegister) => authService.register(payload),
    onSuccess: async (data) => {
      await AsyncStorage.setItem(TOKEN_STORAGE_KEY, data.access_token);
      setToken(data.access_token);
      queryClient.setQueryData(['auth', 'me', data.access_token], data.user);
      router.replace('/(tabs)');
    },
  });

  // 5. Mutasi Update Profile
  const updateProfileMutation = useMutation({
    mutationFn: (payload: UserUpdateProfile) => authService.updateProfile(payload),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['auth', 'me', token], updatedUser);
    },
  });

  // 6. Fungsi Logout
  const logout = async () => {
    try {
      await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
      setToken(null);
      queryClient.removeQueries({ queryKey: ['auth'] });
      router.replace('/login');
    } catch (error) {
      console.error('Error saat logout:', error);
    }
  };

  // 7. Hapus akun pengguna
  const deleteAccountMutation = useMutation({
    mutationFn: (payload: { password: string }) => authService.deleteAccount(payload),
    onSuccess: async () => {
      await logout();
      if (Platform.OS === 'android') {
        ToastAndroid.show('Akun berhasil dihapus.', ToastAndroid.SHORT);
      }
    },
  });

  const isAuthenticating = loginMutation.isPending || registerMutation.isPending || updateProfileMutation.isPending;
  const isLoading = isInitializing || (!!token && isUserLoading);
  const isAuthenticated = !!token && !!user;

  const contextValue = useMemo(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticating,
      isAuthenticated,
      login: loginMutation.mutateAsync,
      register: registerMutation.mutateAsync,
      logout,
      deleteAccount: deleteAccountMutation.mutateAsync,
      updateProfile: updateProfileMutation.mutateAsync,
      refetchUser,
    }),
    [user, token, isLoading, isAuthenticating, isAuthenticated]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

// Custom Hook untuk menggunakan AuthContext di mana pun (misal: login.tsx, Register.tsx, profile.tsx)
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth harus digunakan di dalam komponen AuthProvider');
  }
  return context;
}
