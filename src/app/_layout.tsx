import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { 
  useFonts, 
  Nunito_400Regular, 
  Nunito_600SemiBold, 
  Nunito_700Bold, 
  Nunito_800ExtraBold 
} from '@expo-google-fonts/nunito';
import "../global.css";

import { AnimatedSplashOverlay } from '@/components/animated-icon';

SplashScreen.preventAutoHideAsync();

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

  if (!loaded && !error) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="ai-input" options={{ presentation: 'transparentModal', animation: 'fade', headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}
