import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';
import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
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
import { AuthProvider, useAuth } from '@/context/AuthContext';

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

function RootNavigation({ fontsLoaded }: { fontsLoaded: boolean }) {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);

  // Periksa status onboarding sekali di awal
  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const done = await AsyncStorage.getItem('onboarding_done');
        setHasCompletedOnboarding(done === 'true');
      } catch {
        setHasCompletedOnboarding(false);
      }
    };
    checkOnboarding();
  }, []);

  // Auth Guard Reaktif untuk melindungi seluruh rute aplikasi
  useEffect(() => {
    // Tunggu sampai font selesai dimuat, status onboarding terbaca, dan sesi autentikasi siap
    if (!fontsLoaded || isLoading || hasCompletedOnboarding === null) return;

    // Sembunyikan native splash screen begitu status rute telah terverifikasi
    SplashScreen.hideAsync().catch(() => {});

    const firstSegment = segments[0] as string | undefined;
    const isAuthGroup = firstSegment === 'login' || firstSegment === 'Register' || firstSegment === 'onboarding';

    if (!isAuthenticated) {
      // 1. Pengguna BELUM LOGIN
      if (!isAuthGroup) {
        // Mencoba mengakses rute terproteksi (seperti (tabs), ai-input, ProfilePage)
        if (hasCompletedOnboarding) {
          router.replace('/login');
        } else {
          router.replace('/onboarding');
        }
      }
    } else {
      // 2. Pengguna SUDAH LOGIN
      if (isAuthGroup) {
        // Mencegah pengguna yang sudah login kembali ke halaman login, register, atau onboarding
        router.replace('/(tabs)');
      }
    }
  }, [isAuthenticated, isLoading, fontsLoaded, hasCompletedOnboarding, segments, router]);

  // Jika font belum siap atau status login masih diperiksa, tahan layar dengan Splash Overlay
  if (!fontsLoaded || isLoading || hasCompletedOnboarding === null) {
    return <AnimatedSplashOverlay />;
  }

  return (
    <>
      <AnimatedSplashOverlay />
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="onboarding" options={{ animation: 'fade' }} />
        <Stack.Screen name="login" options={{ animation: 'fade' }} />
        <Stack.Screen name="Register" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="ai-input" options={{ presentation: 'transparentModal', animation: 'fade' }} />
      </Stack>
    </>
  );
}

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

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <RootNavigation fontsLoaded={loaded} />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
