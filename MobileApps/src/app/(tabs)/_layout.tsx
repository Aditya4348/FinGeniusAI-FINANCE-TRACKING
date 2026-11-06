import { Tabs, Redirect } from 'expo-router';
import { CustomTabBar } from '@/components/CustomTabBar';
import { useAuth } from '@/context/AuthContext';

export default function TabsLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  // Tahan rendering jika autentikasi masih diverifikasi
  if (isLoading) {
    return null;
  }

  // Jika tidak memiliki sesi login aktif, alihkan ke halaman login
  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Beranda',
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Riwayat',
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: 'Dompet',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
        }}
      />
    </Tabs>
  );
}
