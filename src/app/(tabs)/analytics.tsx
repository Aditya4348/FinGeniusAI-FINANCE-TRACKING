import { View, Text, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function AnalyticsScreen() {
  const insets = useSafeAreaInsets();

  const CategoryBar = ({ label, percentage, amount, color }: { label: string, percentage: number, amount: string, color: string }) => (
    <View className="mb-5">
      <View className="flex-row justify-between mb-2">
        <Text className="text-[14px] font-['Nunito_700Bold'] text-[#374151]">{label}</Text>
        <Text className="text-[14px] font-['Nunito_800ExtraBold'] text-black">{amount}</Text>
      </View>
      <View className="h-3 bg-[#F2F2F7] rounded-full overflow-hidden flex-row">
        <View className="h-full rounded-full" style={{ width: `${percentage}%`, backgroundColor: color }} />
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-[#F9FAFB]" style={{ paddingTop: insets.top }}>
      
      {/* Header */}
      <View className="px-6 pt-4 pb-6">
        <Text className="text-[24px] font-['Nunito_800ExtraBold'] text-black mb-1">Analitik</Text>
        <Text className="text-[14px] font-['Nunito_600SemiBold'] text-[#8E8E93]">Pengeluaran Bulan Agustus</Text>
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* Total Spending Card */}
        <LinearGradient
          colors={['#0369A1', '#0284C7']}
          className="rounded-3xl p-6 mb-8 shadow-sm"
        >
          <View className="flex-row items-center mb-2">
            <View className="w-8 h-8 rounded-full bg-white/20 items-center justify-center mr-2">
              <FontAwesome5 name="chart-pie" size={14} color="white" />
            </View>
            <Text className="text-white/90 text-[13px] font-['Nunito_600SemiBold']">Total Pengeluaran</Text>
          </View>
          <Text className="text-white text-[32px] font-['Nunito_800ExtraBold'] tracking-tight mb-2">
            Rp 3.450.000
          </Text>
          <View className="flex-row items-center">
            <View className="bg-[#10B981] px-2 py-1 rounded-md mr-2 flex-row items-center">
              <Ionicons name="arrow-down" size={12} color="white" />
              <Text className="text-white text-[11px] font-['Nunito_700Bold'] ml-1">12%</Text>
            </View>
            <Text className="text-white/80 text-[12px] font-['Nunito_600SemiBold']">Lebih hemat dari bulan lalu</Text>
          </View>
        </LinearGradient>

        {/* Categories */}
        <View className="bg-white rounded-3xl p-6 border border-[#F2F2F7]">
          <Text className="text-[16px] font-['Nunito_800ExtraBold'] text-black mb-6">Distribusi Pengeluaran</Text>
          
          <CategoryBar label="🍔 Makanan & Minuman" percentage={45} amount="Rp 1.552.500" color="#EA580C" />
          <CategoryBar label="🚗 Transportasi" percentage={25} amount="Rp 862.500" color="#0284C7" />
          <CategoryBar label="🛒 Belanja" percentage={15} amount="Rp 517.500" color="#8B5CF6" />
          <CategoryBar label="🎬 Hiburan" percentage={10} amount="Rp 345.000" color="#10B981" />
          <CategoryBar label="Lainnya" percentage={5} amount="Rp 172.500" color="#94A3B8" />
        </View>

      </ScrollView>

    </View>
  );
}
