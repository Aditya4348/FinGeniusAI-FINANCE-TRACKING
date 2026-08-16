import { View, Text, ScrollView, Image, Pressable } from 'react-native';
import { GradientCard, CapitalCard, TransactionItem, DailyBudgetCard } from '@/components/FinanceUI';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function OverviewScreen() {
  const router = useRouter();
  const [isCensored, setIsCensored] = useState(false);

  const censor = (val: string) => isCensored ? 'Rp ***.***' : val;
  const censorTx = (val: string) => isCensored ? (val.startsWith('-') ? '-Rp ***' : '+Rp ***') : val;

  return (
    <ScrollView className="flex-1 bg-[#F9FAFB]" contentContainerClassName="p-6 pt-[60px]">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-8">
        <Pressable onPress={() => router.push('/profile')} className="flex-row items-center">
          <View className="w-11 h-11 rounded-full bg-[#F2F2F7] mr-3 overflow-hidden">
            <Image 
              source={{ uri: 'https://i.pravatar.cc/150?img=11' }} 
              className="w-full h-full" 
            />
          </View>
          <View>
            <Text className="text-[13px] text-[#8E8E93] font-['Nunito_600SemiBold']">Selamat datang kembali,</Text>
            <Text className="text-lg text-black font-['Nunito_700Bold']">Aditya</Text>
          </View>
        </Pressable>
        <Pressable 
          onPress={() => setIsCensored(!isCensored)} 
          className="w-10 h-10 rounded-full bg-[#F2F2F7] justify-center items-center"
        >
          <Feather name={isCensored ? "eye-off" : "eye"} size={20} color="black" />
        </Pressable>
      </View>

      {/* Cards */}
      <View className="mb-6">
        <DailyBudgetCard remaining={censor("Rp 45.000")} total={censor("Rp 100.000")} percentage={45} />
        
        <GradientCard balance={censor("Rp 5.827.400")} title="Saldo Utama" />

        <Pressable onPress={() => router.push('/capital')}>
          <CapitalCard balance={censor("Rp 58.274.300")} mom="6.3%" />
        </Pressable>
      </View>

      {/* Transactions */}
      <View className="mt-2">
        <Text className="text-sm text-[#8E8E93] font-['Nunito_600SemiBold'] mb-4">Transaksi Terakhir</Text>
        
        <TransactionItem 
          title="Bibit Reksadana"
          subtitle="Hari ini 13:30"
          badgeText="BCA"
          badgeColor="blue"
          amount={censorTx("-Rp 500.000")}
        />
        <TransactionItem 
          title="Netflix"
          subtitle="27 Jun 10:30"
          badgeText="Gopay"
          badgeColor="purple"
          amount={censorTx("-Rp 186.000")}
        />
        <TransactionItem 
          title="Budi Santoso"
          subtitle="26 Jun 20:30"
          badgeText="Mandiri"
          badgeColor="yellow"
          amount={censorTx("+Rp 150.000")}
        />
        <TransactionItem 
          title="Indomaret"
          subtitle="26 Jun 18:30"
          badgeText="Tunai"
          badgeColor="green"
          amount={censorTx("-Rp 75.000")}
        />
      </View>
      
      {/* Bottom Padding for TabBar */}
      <View className="h-[100px]" />
    </ScrollView>
  );
}