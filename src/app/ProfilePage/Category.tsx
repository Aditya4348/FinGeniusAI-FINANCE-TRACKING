import { View, Text, ScrollView, Pressable, Switch, LayoutAnimation, UIManager, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';

// Data Dummy Prototype
const EXPENSE_CATEGORIES = [
  { id: '1', name: 'Makanan & Minuman', icon: 'coffee', color: '#F59E0B', bg: '#FFFBEB', locked: true },
  { id: '2', name: 'Transportasi', icon: 'navigation', color: '#3B82F6', bg: '#EFF6FF', locked: true },
  { id: '3', name: 'Tagihan & Cicilan', icon: 'file-text', color: '#EF4444', bg: '#FEF2F2', locked: true },
  { id: '4', name: 'Belanja Bulanan', icon: 'shopping-cart', color: '#10B981', bg: '#F0FDF4', locked: false },
  { id: '5', name: 'Hiburan', icon: 'tv', color: '#8B5CF6', bg: '#F3E8FF', locked: false },
  { id: '6', name: 'Kopi & Nongkrong', icon: 'smile', color: '#A855F7', bg: '#FAF5FF', locked: false },
];

const INCOME_CATEGORIES = [
  { id: '7', name: 'Gaji Pokok', icon: 'briefcase', color: '#10B981', bg: '#F0FDF4', locked: true },
  { id: '8', name: 'Investasi & Bunga', icon: 'trending-up', color: '#3B82F6', bg: '#EFF6FF', locked: true },
  { id: '9', name: 'Hadiah / Bonus', icon: 'gift', color: '#F59E0B', bg: '#FFFBEB', locked: false },
];

export default function CategoryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<'expense' | 'income'>('expense');
  const [aiAutoCreate, setAiAutoCreate] = useState(true);

  const displayData = activeTab === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const handleTabChange = (tab: 'expense' | 'income') => {
    setActiveTab(tab);
  };

  return (
    <View className="flex-1 bg-[#EEF3F9]" style={{ paddingTop: insets.top }}>
      
      {/* HEADER */}
      <View className="flex-row items-center justify-between px-6 pt-4 pb-2">
        <View className="flex-row items-center">
          <Pressable 
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-white items-center justify-center border border-[#E2EAF3] mr-4"
          >
            <Feather name="arrow-left" size={20} color="#0F172A" />
          </Pressable>
          <Text className="text-[22px] font-['Nunito_800ExtraBold'] text-[#0F172A] tracking-tight">Kategori</Text>
        </View>
        <Pressable className="w-10 h-10 rounded-full bg-[#E2EAF3] items-center justify-center">
          <Feather name="search" size={20} color="#475569" />
        </Pressable>
      </View>

      {/* TABS KUSTOM (SANGAT DIREKOMENDASIKAN UNTUK KASUS INI) */}
      <View className="px-6 mt-4 mb-2">
        <View className="flex-row bg-[#E2EAF3] rounded-2xl p-1">
          <Pressable 
            onPress={() => handleTabChange('expense')}
            className="flex-1 py-3 rounded-xl items-center justify-center"
            style={activeTab === 'expense' ? { backgroundColor: 'white', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 } : { backgroundColor: 'transparent' }}
          >
            <Text className={`text-[14px] font-['Nunito_700Bold'] ${activeTab === 'expense' ? 'text-[#EF4444]' : 'text-[#64748B]'}`}>
              Pengeluaran
            </Text>
          </Pressable>
          <Pressable 
            onPress={() => handleTabChange('income')}
            className="flex-1 py-3 rounded-xl items-center justify-center"
            style={activeTab === 'income' ? { backgroundColor: 'white', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 } : { backgroundColor: 'transparent' }}
          >
            <Text className={`text-[14px] font-['Nunito_700Bold'] ${activeTab === 'income' ? 'text-[#10B981]' : 'text-[#64748B]'}`}>
              Pemasukan
            </Text>
          </Pressable>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* List Data Category */}
        <View className="px-6 mt-4">
          <View 
            className="bg-white rounded-[24px] p-2"
            style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 2 }}
          >
            {displayData.map((cat, index) => (
              <View
                key={cat.id}
                className="flex-row items-center justify-between p-3"
                style={{ 
                  borderBottomWidth: index !== displayData.length - 1 ? 1 : 0, 
                  borderBottomColor: '#F1F5F9' 
                }}
              >
                <View className="flex-row items-center flex-1">
                  <View className="w-12 h-12 rounded-2xl items-center justify-center mr-4" style={{ backgroundColor: cat.bg }}>
                    {/* Menggunakan 'as any' untuk mencegah error TypeScript karena tipe data array terdeteksi sebagai string biasa */}
                    <Feather name={cat.icon as any} size={24} color={cat.color} />
                  </View>
                  <Text className="text-[15px] font-['Nunito_700Bold'] text-[#0F172A]">{cat.name}</Text>
                </View>

                {cat.locked ? (
                  <View className="px-2">
                    <Feather name="lock" size={16} color="#CBD5E1" />
                  </View>
                ) : (
                  <Pressable className="px-2">
                    <Feather name="edit-2" size={18} color="#94A3B8" />
                  </Pressable>
                )}
              </View>
            ))}
          </View>
        </View>


        {/* TOMBOL TAMBAH */}
        <View className="px-6 mt-6">
          <Pressable className="flex-row items-center justify-center py-4 bg-white border-2 border-dashed border-[#CBD5E1] rounded-[20px]">
            <Feather name="plus-circle" size={20} color="#3B82F6" />
            <Text className="text-[15px] font-['Nunito_800ExtraBold'] text-[#3B82F6] ml-2">Buat Kategori Baru</Text>
          </Pressable>
        </View>

        {/* AI SMART RULES SECTION */}
        <View className="px-6 mt-8">
          <Text className="text-[14px] font-['Nunito_800ExtraBold'] text-[#94A3B8] mb-3 ml-2 uppercase tracking-wider">
            Pengaturan Kecerdasan AI
          </Text>
          
          <View className="bg-white rounded-[24px] p-2"
            style={{ shadowColor: '#9333EA', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 }}
          >
            {/* Auto Create Toggle */}
            <View className="flex-row items-center justify-between p-4 border-b border-[#F1F5F9]">
              <View className="flex-row items-center flex-1 pr-4">
                <View className="w-10 h-10 rounded-full bg-[#F3E8FF] items-center justify-center mr-3">
                  <MaterialCommunityIcons name="auto-fix" size={20} color="#9333EA" />
                </View>
                <View className="flex-1">
                  <Text className="text-[15px] font-['Nunito_800ExtraBold'] text-[#0F172A]">AI Auto-Create</Text>
                  <Text className="text-[12px] font-['Nunito_600SemiBold'] text-[#64748B] mt-0.5">Izinkan AI membuat kategori baru jika tidak ada yang cocok</Text>
                </View>
              </View>
              <Switch 
                value={aiAutoCreate} 
                onValueChange={setAiAutoCreate} 
                trackColor={{ false: '#E2EAF3', true: '#9333EA' }} 
                thumbColor={'#ffffff'} 
              />
            </View>

            {/* Smart Mapping Button */}
            <Pressable className="flex-row items-center justify-between p-4">
              <View className="flex-row items-center flex-1 pr-4">
                <View className="w-10 h-10 rounded-full bg-[#EFF6FF] items-center justify-center mr-3">
                  <Feather name="git-merge" size={18} color="#3B82F6" />
                </View>
                <View className="flex-1">
                  <Text className="text-[15px] font-['Nunito_800ExtraBold'] text-[#0F172A]">Kamus Mapping AI</Text>
                  <Text className="text-[12px] font-['Nunito_600SemiBold'] text-[#64748B] mt-0.5">Misal: "Gojek" selalu masuk ke "Transportasi"</Text>
                </View>
              </View>
              <Feather name="chevron-right" size={20} color="#94A3B8" />
            </Pressable>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}
