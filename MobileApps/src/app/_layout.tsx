import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';
import { useEffect, useState } from 'react';
import { Stack, router } from 'expo-router';
import { 
  useFonts, 
  Nunito_400Regular, 
  Nunito_600SemiBold, 
  Nunito_700Bold, 
  Nunito_800ExtraBold 
} from '@expo-google-fonts/nunito';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import "../global.css";
import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { AuthProvider } from '@/context/AuthContext';
import { TOKEN_STORAGE_KEY } from '@/services/api';

SplashScreen.preventAutoHideAsync();

// Instance QueryClient terpusat untuk TanStack React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [loaded, error] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (!loaded && !error) return;

    // Cek status sesi login dan onboarding saat aplikasi terbuka
    const checkInitialRoute = async () => {
      await SplashScreen.hideAsync();
      const token = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
      const done = await AsyncStorage.getItem('onboarding_done');

      if (token) {
        // Pengguna sudah login -> langsung arahkan ke Dashboard
        router.replace('/(tabs)');
      } else if (done === 'true') {
        // Sudah onboarding -> ke halaman Login
        router.replace('/login');
      } else {
        // Pertama kali buka aplikasi -> ke Onboarding
        router.replace('/onboarding');
      }
    };

    checkInitialRoute();
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <AnimatedSplashOverlay />
          <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
            <Stack.Screen name="onboarding" options={{ animation: 'fade' }} />
            <Stack.Screen name="login" options={{ animation: 'fade' }} />
            <Stack.Screen name="Register" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="ai-input" options={{ presentation: 'transparentModal', animation: 'fade' }} />
          </Stack>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
