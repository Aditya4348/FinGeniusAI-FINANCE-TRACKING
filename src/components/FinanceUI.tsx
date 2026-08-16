import { View, Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons';

// Types
export interface TransactionItemProps {
  iconUrl?: string;
  title: string;
  subtitle: string;
  badgeText?: string;
  badgeColor?: string;
  amount: string;
}

export function Badge({ text, color = '#F2F2F7', textColor = '#000' }: { text: string, color?: string, textColor?: string }) {
  return (
    <View className="px-1.5 py-0.5 rounded-md ml-1.5 border border-black/5" style={{ backgroundColor: color }}>
      <Text className="text-[10px] font-['Nunito_700Bold']" style={{ color: textColor }}>{text}</Text>
    </View>
  );
}

export function GradientCard({ balance, title }: { balance: string, title?: string }) {
  return (
    <LinearGradient
      colors={['#0369A1', '#0284C7']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ borderRadius: 24, overflow: 'hidden' }}
      className="p-6 h-[180px] justify-between mb-5"
    >
      <View className="flex-row justify-between items-center">
        <Text className="text-white/80 text-sm font-['Nunito_600SemiBold']">{title || 'Saldo Utama'}</Text>
        <AntDesign name="ellipsis1" size={24} color="white" />
      </View>
      <View className="flex-row justify-between items-end">
        <Text className="text-white text-3xl font-['Nunito_800ExtraBold']">{balance}</Text>
        <Pressable className="bg-white/25 px-4 py-2.5 rounded-full flex-row items-center">
          <AntDesign name="plus" size={14} color="white" />
          <Text className="text-white text-sm font-['Nunito_600SemiBold'] ml-1.5">Isi Saldo</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

export function CapitalCard({ balance, mom }: { balance: string, mom: string }) {
  return (
    <View className="bg-[#0F172A] rounded-[20px] p-4 flex-row items-center mb-8">
      <View className="w-10 h-10 rounded-full bg-white/10 justify-center items-center mr-4">
        <View className="w-5 h-5 rounded-full bg-white" />
      </View>
      <View className="flex-1">
        <Text className="text-white/60 text-[13px] font-['Nunito_600SemiBold']">Total Aset</Text>
        <Text className="text-white text-lg font-['Nunito_700Bold']">{balance}</Text>
      </View>
      <View className="items-end">
        <Text className="text-white/60 text-[13px] font-['Nunito_600SemiBold']">Pertumbuhan</Text>
        <Text className="text-[#34C759] text-[15px] font-['Nunito_700Bold']">{mom}</Text>
      </View>
    </View>
  );
}

export function DailyBudgetCard({ remaining, total, percentage }: { remaining: string, total: string, percentage: number }) {
  return (
    <View className="bg-white rounded-3xl p-6 border border-[#E5E5EA] shadow-sm elevation-sm mb-5">
      <View className="flex-row justify-between items-start mb-6">
        <View>
          <Text className="text-[#8E8E93] text-sm font-['Nunito_600SemiBold'] mb-1">Sisa Jatah Harian</Text>
          <Text className="text-black text-3xl font-['Nunito_800ExtraBold'] tracking-tighter">{remaining}</Text>
        </View>
        <View className="w-10 h-10 rounded-full bg-[#ECFDF3] justify-center items-center">
          <AntDesign name="checkcircle" size={20} color="#027A48" />
        </View>
      </View>

      <View className="mb-2">
        <View className="h-2 w-full bg-[#F2F2F7] rounded-full overflow-hidden">
          <View 
            className="h-full bg-[#027A48] rounded-full" 
            style={{ width: `${percentage}%` }}
          />
        </View>
      </View>
      
      <View className="flex-row justify-between items-center">
        <Text className="text-[#8E8E93] text-xs font-['Nunito_600SemiBold']">{percentage}% aman</Text>
        <Text className="text-[#8E8E93] text-xs font-['Nunito_600SemiBold']">dari {total}</Text>
      </View>
    </View>
  );
}

export function TransactionItem({ title, subtitle, badgeText, badgeColor, amount }: TransactionItemProps) {
  let bColor = '#FDEBEB'; // light red
  let tColor = '#D92D20'; // red
  if (badgeColor === 'green') {
    bColor = '#ECFDF3';
    tColor = '#027A48';
  } else if (badgeColor === 'yellow') {
    bColor = '#FFFAEB';
    tColor = '#B54708';
  } else if (badgeColor === 'blue') {
    bColor = '#EFF8FF';
    tColor = '#175CD3';
  } else if (badgeColor === 'purple') {
    bColor = '#F4F3FF';
    tColor = '#5925DC';
  }

  return (
    <View className="flex-row items-center py-4 border-b border-[#E5E5EA]">
      <View className="w-10 h-10 rounded-full bg-[#F2F2F7] justify-center items-center mr-4">
        <Text className="text-lg font-['Nunito_700Bold'] text-[#8E8E93]">{title.substring(0, 1)}</Text>
      </View>
      <View className="flex-1">
        <View className="flex-row items-center mb-1">
          <Text className="text-base font-['Nunito_700Bold'] text-black">{title}</Text>
          {badgeText && <Badge text={badgeText} color={bColor} textColor={tColor} />}
        </View>
        <Text className="text-[13px] font-['Nunito_600SemiBold'] text-[#8E8E93]">{subtitle}</Text>
      </View>
      <Text className="text-base font-['Nunito_700Bold'] text-black">{amount}</Text>
    </View>
  );
}
