import { View, Text, ScrollView, Pressable } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { PieChart } from 'react-native-gifted-charts';
import { Badge } from '@/components/FinanceUI';

export default function AnalyticsScreen() {
  const pieData = [
    { value: 35, color: '#FF4B4B' },
    { value: 24, color: '#FF7F50' },
    { value: 20, color: '#34C759' },
    { value: 15, color: '#007AFF' },
    { value: 6, color: '#AF52DE' },
  ];

  return (
    <ScrollView className="flex-1 bg-white" contentContainerClassName="p-6 pt-[60px]">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-8">
        <Text className="text-2xl font-['Nunito_800ExtraBold'] text-black">Analitik</Text>
        <Pressable className="w-10 h-10 rounded-full bg-[#F2F2F7] justify-center items-center">
          <AntDesign name="setting" size={24} color="black" />
        </Pressable>
      </View>

      {/* Segmented Control */}
      <View className="flex-row bg-[#F2F2F7] rounded-[20px] p-1 mb-10">
        <Pressable className="flex-1 py-2.5 items-center rounded-2xl bg-white shadow-sm elevation-sm">
          <Text className="text-[13px] font-['Nunito_700Bold'] text-black">Bulan ini</Text>
        </Pressable>
        <Pressable className="flex-1 py-2.5 items-center rounded-2xl">
          <Text className="text-[13px] font-['Nunito_600SemiBold'] text-[#8E8E93]">Bulan lalu</Text>
        </Pressable>
        <Pressable className="flex-1 py-2.5 items-center rounded-2xl">
          <Text className="text-[13px] font-['Nunito_600SemiBold'] text-[#8E8E93]">Kustom</Text>
        </Pressable>
      </View>

      {/* Net Income */}
      <View className="mb-10">
        <Text className="text-sm text-[#8E8E93] font-['Nunito_600SemiBold'] mb-4">Pendapatan Bersih</Text>
        <View className="flex-row items-baseline mb-3">
          <Text className="text-[32px] font-['Nunito_800ExtraBold'] text-black">Rp </Text>
          <Text className="text-[48px] font-['Nunito_800ExtraBold'] text-black tracking-tighter">3.152</Text>
          <Text className="text-[32px] font-['Nunito_800ExtraBold'] text-[#8E8E93]">.300</Text>
          <Pressable className="w-7 h-7 rounded-full bg-black justify-center items-center ml-3 self-center">
            <AntDesign name="plus" size={16} color="white" />
          </Pressable>
        </View>
        <View className="flex-row items-center">
          <Badge text="6.3%" color="#ECFDF3" textColor="#027A48" />
          <Text className="ml-2 text-[13px] font-['Nunito_600SemiBold'] text-[#8E8E93]">
            Bulan ke Bulan <AntDesign name="down" size={10} color="#8E8E93" />
          </Text>
        </View>
      </View>

      {/* Expenses */}
      <View className="bg-white">
        <Text className="text-sm text-[#8E8E93] font-['Nunito_600SemiBold'] mb-4">Pengeluaran</Text>
        
        <View className="items-center mb-8">
          <PieChart
            data={pieData}
            donut
            innerRadius={80}
            radius={110}
            innerCircleColor={'#fff'}
            centerLabelComponent={() => {
              return (
                <View className="items-center justify-center">
                  <Text className="text-xl font-['Nunito_800ExtraBold'] text-black">Rp 5.097.200</Text>
                  <Text className="text-xs font-['Nunito_600SemiBold'] text-[#8E8E93]">Total keluar</Text>
                </View>
              );
            }}
          />
        </View>

        {/* Legend */}
        <View className="gap-4">
          <LegendItem color="#FF4B4B" name="Kebutuhan Pokok" percentage="35%" amount="Rp 1.784.000" />
          <LegendItem color="#FF7F50" name="Makan & Minum" percentage="24%" amount="Rp 1.223.300" />
        </View>
      </View>
      
      {/* Bottom Padding for TabBar */}
      <View className="h-[100px]" />
    </ScrollView>
  );
}

function LegendItem({ color, name, percentage, amount }: { color: string, name: string, percentage: string, amount: string }) {
  return (
    <View className="flex-row justify-between items-center">
      <View className="flex-row items-center">
        <View className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: color }} />
        <Text className="text-sm font-['Nunito_700Bold'] text-black mr-2">{name}</Text>
        <View className="bg-[#F2F2F7] px-1.5 py-0.5 rounded-md">
          <Text className="text-[10px] font-['Nunito_700Bold'] text-[#8E8E93]">{percentage}</Text>
        </View>
      </View>
      <Text className="text-sm font-['Nunito_700Bold'] text-black">{amount}</Text>
    </View>
  );
}
