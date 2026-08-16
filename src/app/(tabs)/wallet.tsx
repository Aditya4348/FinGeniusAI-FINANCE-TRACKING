import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { AntDesign, Feather } from '@expo/vector-icons';
import { TransactionItem, Badge } from '@/components/FinanceUI';

export default function CapitalScreen() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-[#F9FAFB]" contentContainerClassName="p-6 pt-[60px]">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-10">
        <Pressable onPress={() => router.back()} className="w-10 h-10 rounded-full justify-center items-center">
          <Feather name="chevron-left" size={24} color="black" />
        </Pressable>
        <Text className="text-base font-['Nunito_700Bold'] text-black">Aset Saya</Text>
        <Pressable className="w-10 h-10 rounded-full justify-center items-center">
          <Feather name="bar-chart-2" size={20} color="black" />
        </Pressable>
      </View>

      {/* Main Balance */}
      <View className="mb-10">
        <View className="flex-row items-baseline mb-3">
          <Text className="text-[32px] font-['Nunito_800ExtraBold'] text-black">Rp </Text>
          <Text className="text-[48px] font-['Nunito_800ExtraBold'] text-black tracking-tighter">58.274</Text>
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

      {/* Sources */}
      <View className="mb-10">
        <Text className="text-sm text-[#8E8E93] font-['Nunito_600SemiBold'] mb-4">Sumber Dana</Text>
        
        {/* Horizontal Bar */}
        <View className="flex-row h-6 rounded-xl overflow-hidden mb-6 gap-0.5">
          <View className="h-full flex-[10] bg-[#FF4B4B]" />
          <View className="h-full flex-[13] bg-[#FF7F50]" />
          <View className="h-full flex-[18] bg-[#34C759]" />
          <View className="h-full flex-[25] bg-[#007AFF]" />
          <View className="h-full flex-[34] bg-[#AF52DE]" />
        </View>

        {/* Legend */}
        <View className="gap-4">
          <LegendItem color="#FF4B4B" name="BCA" percentage="10%" amount="Rp 5.827.400" />
          <LegendItem color="#FF7F50" name="Mandiri" percentage="13%" amount="Rp 7.575.600" />
          <LegendItem color="#34C759" name="Tunai" percentage="18%" amount="Rp 10.489.300" />
          <LegendItem color="#007AFF" name="Tabungan" percentage="25%" amount="Rp 14.568.600" />
          <LegendItem color="#AF52DE" name="Investasi" percentage="34%" amount="Rp 19.813.200" />
        </View>
      </View>

      {/* Incomes */}
      <View className="mt-2">
        <Text className="text-sm text-[#8E8E93] font-['Nunito_600SemiBold'] mb-4">Pemasukan Terakhir</Text>
        <TransactionItem 
          title="Gaji Bulanan"
          subtitle="15 Jun 08:00"
          badgeText="BCA"
          badgeColor="blue"
          amount="Rp 15.000.000"
        />
        <TransactionItem 
          title="Pencairan Deposito"
          subtitle="26 Jun 13:30"
          badgeText="Tabungan"
          badgeColor="purple"
          amount="Rp 10.000.000"
        />
        <TransactionItem 
          title="Dividen Saham"
          subtitle="26 Jun 18:30"
          badgeText="Investasi"
          badgeColor="green"
          amount="Rp 5.000.000"
        />
      </View>
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
