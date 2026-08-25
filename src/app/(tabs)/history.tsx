import { View, Text, ScrollView, Pressable, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

// Dummy Data
const TRANSACTIONS = [
  { id: '1', title: 'Makan Siang (Sate Ayam)', category: 'Makanan', amount: '-Rp 25.000', type: 'expense', date: 'Hari Ini, 12:30', icon: 'fast-food-outline', color: '#EA580C', bg: '#FFF4ED' },
  { id: '2', title: 'Top up DANA', category: 'Transfer', amount: '+Rp 500.000', type: 'income', date: 'Hari Ini, 09:15', icon: 'wallet-outline', color: '#059669', bg: '#ECFDF3' },
  { id: '3', title: 'Netflix Subscription', category: 'Hiburan', amount: '-Rp 153.000', type: 'expense', date: 'Kemarin, 19:00', icon: 'tv-outline', color: '#8B5CF6', bg: '#F5F3FF' },
  { id: '4', title: 'Gojek ke Kantor', category: 'Transportasi', amount: '-Rp 18.000', type: 'expense', date: 'Kemarin, 08:00', icon: 'car-outline', color: '#0284C7', bg: '#EFF8FF' },
  { id: '5', title: 'Gaji Bulanan', category: 'Pemasukan', amount: '+Rp 8.500.000', type: 'income', date: '23 Agustus 2026', icon: 'cash-outline', color: '#059669', bg: '#ECFDF3' },
  { id: '6', title: 'Beli Kopi', category: 'Makanan', amount: '-Rp 22.000', type: 'expense', date: '23 Agustus 2026', icon: 'cafe-outline', color: '#EA580C', bg: '#FFF4ED' },
];

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<'semua' | 'masuk' | 'keluar'>('semua');

  const filteredData = TRANSACTIONS.filter((t) => {
    if (filter === 'semua') return true;
    if (filter === 'masuk') return t.type === 'income';
    if (filter === 'keluar') return t.type === 'expense';
    return true;
  });

  const renderTransaction = ({ item }: { item: typeof TRANSACTIONS[0] }) => (
    <View className="flex-row items-center justify-between mb-4 bg-white p-4 rounded-2xl border border-[#F2F2F7]">
      <View className="flex-row items-center">
        <View className="w-12 h-12 rounded-full items-center justify-center mr-3" style={{ backgroundColor: item.bg }}>
          <Ionicons name={item.icon as any} size={20} color={item.color} />
        </View>
        <View>
          <Text className="text-[15px] font-['Nunito_700Bold'] text-black mb-0.5">{item.title}</Text>
          <View className="flex-row items-center">
            <Text className="text-[12px] font-['Nunito_600SemiBold'] text-[#8E8E93]">{item.category}</Text>
            <View className="w-1 h-1 rounded-full bg-[#D1D1D6] mx-2" />
            <Text className="text-[12px] font-['Nunito_600SemiBold'] text-[#8E8E93]">{item.date}</Text>
          </View>
        </View>
      </View>
      <Text className={`text-[15px] font-['Nunito_800ExtraBold'] ${item.type === 'income' ? 'text-[#059669]' : 'text-black'}`}>
        {item.amount}
      </Text>
    </View>
  );

  return (
    <View className="flex-1 bg-[#F9FAFB]" style={{ paddingTop: insets.top }}>
      
      {/* Header */}
      <View className="px-6 pt-4 pb-2">
        <Text className="text-[24px] font-['Nunito_800ExtraBold'] text-black">Riwayat Transaksi</Text>
      </View>

      {/* Filter Tabs */}
      <View className="flex-row px-6 mt-4 mb-2">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Pressable 
            onPress={() => setFilter('semua')}
            className={`px-5 py-2 rounded-full mr-2 border ${filter === 'semua' ? 'bg-[#0369A1] border-[#0369A1]' : 'bg-white border-[#E5E5EA]'}`}
          >
            <Text className={`text-[13px] font-['Nunito_700Bold'] ${filter === 'semua' ? 'text-white' : 'text-[#8E8E93]'}`}>Semua</Text>
          </Pressable>
          <Pressable 
            onPress={() => setFilter('masuk')}
            className={`px-5 py-2 rounded-full mr-2 border ${filter === 'masuk' ? 'bg-[#059669] border-[#059669]' : 'bg-white border-[#E5E5EA]'}`}
          >
            <Text className={`text-[13px] font-['Nunito_700Bold'] ${filter === 'masuk' ? 'text-white' : 'text-[#8E8E93]'}`}>Uang Masuk</Text>
          </Pressable>
          <Pressable 
            onPress={() => setFilter('keluar')}
            className={`px-5 py-2 rounded-full mr-2 border ${filter === 'keluar' ? 'bg-[#EA580C] border-[#EA580C]' : 'bg-white border-[#E5E5EA]'}`}
          >
            <Text className={`text-[13px] font-['Nunito_700Bold'] ${filter === 'keluar' ? 'text-white' : 'text-[#8E8E93]'}`}>Uang Keluar</Text>
          </Pressable>
        </ScrollView>
      </View>

      {/* Transaction List */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={renderTransaction}
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />

    </View>
  );
}
