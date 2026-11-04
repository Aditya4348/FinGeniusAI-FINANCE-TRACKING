import { View, Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign, Feather } from '@expo/vector-icons';

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

export function GradientCard({ balance, title, onTopUpPress }: { balance: string, title: string, onTopUpPress?: () => void }) {
  return (
    <LinearGradient
      colors={['#075985', '#0284C7', '#38BDF8']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ borderRadius: 24, padding: 20, marginBottom: 16, position: 'relative', overflow: 'hidden', shadowColor: '#0284C7', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 }}
    >
      <View className="absolute right-0 top-0 w-36 h-36 rounded-full bg-white/10 -mr-12 -mt-14" />
      <View className="absolute left-0 bottom-0 w-28 h-28 rounded-full bg-white/10 -ml-12 -mb-14" />
      <View className="absolute right-7 top-16 opacity-10">
        <Feather name="credit-card" size={88} color="white" />
      </View>

      <View className="flex-row items-center justify-between mb-5">
        <View className="flex-row items-center">
          <View className="w-8 h-8 rounded-full bg-white/20 items-center justify-center mr-2.5">
            <Feather name="credit-card" size={15} color="white" />
          </View>
          <Text className="text-white font-['Nunito_700Bold'] text-sm tracking-wide">{title}</Text>
        </View>
        <View className="flex-row items-center rounded-full bg-white/15 border border-white/20 px-3 py-1">
          <View className="w-1.5 h-1.5 rounded-full bg-[#86EFAC] mr-1.5" />
          <Text className="text-white text-[10px] font-['Nunito_700Bold'] tracking-wider">AKTIF</Text>
        </View>
      </View>

      <Text className="text-white/75 text-xs font-['Nunito_600SemiBold'] mb-1">Total saldo</Text>
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        className="text-white text-[32px] font-['Nunito_800ExtraBold'] mb-5 tracking-tight"
      >
        {balance}
      </Text>

      <View className="flex-row items-center gap-3">
        <Pressable 
          onPress={onTopUpPress}
          accessibilityRole="button"
          accessibilityLabel="Isi saldo"
          className="flex-1 min-h-12 flex-row items-center justify-center bg-white/20 border border-white/25 px-3 py-2.5 rounded-2xl active:opacity-80"
        >
          <Feather name="plus-circle" size={17} color="white" />
          <Text className="text-white text-[13px] font-['Nunito_700Bold'] ml-2">Isi Saldo</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Transfer"
          className="flex-1 min-h-12 flex-row items-center justify-center bg-white/10 border border-white/20 px-3 py-2.5 rounded-2xl active:opacity-80"
        >
          <Feather name="arrow-up-right" size={17} color="white" />
          <Text className="text-white text-[13px] font-['Nunito_700Bold'] ml-2">Transfer</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

export function CapitalCard({ balance, mom }: { balance: string, mom: string }) {
  return (
    <View 
      style={{ borderRadius: 24 }}
      className="bg-[#0F172A] rounded-[24px] p-4 flex-row items-center mb-6 border border-[#1E293B] shadow-md shadow-slate-900/10"
    >
      <View className="w-10 h-10 rounded-full bg-white/10 justify-center items-center mr-3.5">
        <Feather name="pie-chart" size={18} color="#38BDF8" />
      </View>
      <View className="flex-1">
        <Text className="text-white/60 text-[12px] font-['Nunito_600SemiBold']">Total Aset</Text>
        <Text className="text-white text-[17px] font-['Nunito_700Bold'] mt-0.5">{balance}</Text>
      </View>
      <View className="items-end">
        <Text className="text-white/60 text-[12px] font-['Nunito_600SemiBold']">Pertumbuhan</Text>
        <View className="flex-row items-center mt-0.5">
          <Feather name="trending-up" size={14} color="#34C759" className="mr-1" />
          <Text className="text-[#34C759] text-[14px] font-['Nunito_700Bold']">{mom}</Text>
        </View>
      </View>
    </View>
  );
}

export function DailyBudgetCard({ remaining, total, percentage }: { remaining: string, total: string, percentage: number }) {
  return (
    <View 
      style={{ borderRadius: 24 }}
      className="bg-white rounded-[24px] p-5 border border-[#E2E8F0] shadow-sm mb-4"
    >
      <View className="flex-row justify-between items-start mb-4">
        <View>
          <Text className="text-[#64748B] text-xs font-['Nunito_600SemiBold'] mb-1">Sisa Jatah Harian</Text>
          <Text className="text-[#0F172A] text-[28px] font-['Nunito_800ExtraBold'] tracking-tight">{remaining}</Text>
        </View>
        <View className="w-9 h-9 rounded-full bg-[#ECFDF3] justify-center items-center">
          <AntDesign name="check-circle" size={18} color="#027A48" />
        </View>
      </View>

      <View className="mb-2">
        <View className="h-2 w-full bg-[#F1F5F9] rounded-full overflow-hidden">
          <View 
            className="h-full bg-[#027A48] rounded-full" 
            style={{ width: `${Math.min(Math.max(percentage, 0), 100)}%` }}
          />
        </View>
      </View>
      
      <View className="flex-row justify-between items-center pt-1">
        <Text className="text-[#64748B] text-xs font-['Nunito_600SemiBold']">{percentage}% aman</Text>
        <Text className="text-[#64748B] text-xs font-['Nunito_600SemiBold']">dari {total}</Text>
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
