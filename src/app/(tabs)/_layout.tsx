import { Tabs } from 'expo-router';
import { CustomTabBar } from '@/components/CustomTabBar';

export default function TabsLayout() {
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
        name="analytics"
        options={{
          title: 'Analitik',
        }}
      />
      <Tabs.Screen
        name="savings"
        options={{
          title: 'Tabungan',
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: 'Dompet',
        }}
      />
    </Tabs>
  );
}
