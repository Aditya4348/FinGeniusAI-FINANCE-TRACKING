import { View, Text, ScrollView, Pressable, Modal, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { BlurView } from 'expo-blur';

// Data Dummy
const SPENDING_DATA = [
  { id: '1', name: 'Makanan & Minuman', amount: 'Rp 1.550.000', percentage: 45, color: '#F59E0B', icon: 'food-outline', bg: '#FEF3C7' },
  { id: '2', name: 'Transportasi', amount: 'Rp 860.000', percentage: 25, color: '#3B82F6', icon: 'car-outline', bg: '#DBEAFE' },
  { id: '3', name: 'Belanja', amount: 'Rp 510.000', percentage: 15, color: '#8B5CF6', icon: 'shopping-outline', bg: '#EDE9FE' },
  { id: '4', name: 'Hiburan', amount: 'Rp 340.000', percentage: 10, color: '#10B981', icon: 'movie-outline', bg: '#D1FAE5' },
  { id: '5', name: 'Lainnya', amount: 'Rp 190.000', percentage: 5, color: '#94A3B8', icon: 'dots-horizontal', bg: '#F1F5F9' },
];

const PERIOD_OPTIONS = ['Bulan Ini', 'Bulan Lalu', '3 Bulan Terakhir', 'Tahun Ini'];

export default function AnalyticsScreen({ embedded = false }: { embedded?: boolean }) {
  const insets = useSafeAreaInsets();
  const [period, setPeriod] = useState('Bulan Ini');
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <View className="flex-1" style={{ backgroundColor: '#EEF3F9', paddingTop: embedded ? 0 : insets.top }}>
      
      {/* Header & Period Selector */}
      <View className="flex-row items-center justify-between px-6 pt-4 pb-2">
        <Text className="text-[26px] font-['Nunito_800ExtraBold'] text-[#0F172A] tracking-tight">Analitik</Text>
        
        <Pressable 
          onPress={() => setIsModalVisible(true)}
          className="flex-row items-center bg-white px-3 py-1.5 rounded-full border border-[#E2EAF3]"
        >
          <Text className="text-[13px] font-['Nunito_700Bold'] text-[#475569] mr-1">{period}</Text>
          <Feather name="chevron-down" size={16} color="#475569" />
        </Pressable>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 110 }}
      >
        {/* Main Spending Card */}
        <View 
          className="bg-white p-6 rounded-[24px] mb-6"
          style={{
            shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.04, shadowRadius: 12, elevation: 2,
          }}
        >
          <Text className="text-[14px] font-['Nunito_600SemiBold'] text-[#64748B] mb-1">Total Pengeluaran</Text>
          <Text className="text-[34px] font-['Nunito_800ExtraBold'] text-[#0F172A] tracking-tight mb-5">
            Rp 3.450.000
          </Text>

          {/* Stacked Bar Chart */}
          <View className="h-4 rounded-full flex-row overflow-hidden mb-5">
            {SPENDING_DATA.map((item, index) => (
              <View 
                key={item.id} 
                style={{ 
                  width: `${item.percentage}%`, 
                  backgroundColor: item.color,
                  borderRightWidth: index < SPENDING_DATA.length - 1 ? 2 : 0,
                  borderColor: 'white'
                }} 
              />
            ))}
          </View>

          {/* Quick Insight */}
          <View className="flex-row items-center bg-[#F8FAFC] p-3 rounded-2xl border border-[#F1F5F9]">
            <View className="w-8 h-8 rounded-full bg-[#D1FAE5] items-center justify-center mr-3">
              <Feather name="trending-down" size={16} color="#059669" />
            </View>
            <View className="flex-1">
              <Text className="text-[13px] font-['Nunito_700Bold'] text-[#0F172A]">Lebih hemat 12%</Text>
              <Text className="text-[12px] font-['Nunito_600SemiBold'] text-[#64748B]">dibandingkan bulan lalu</Text>
            </View>
          </View>
        </View>

        {/* Category Breakdown */}
        <Text className="text-[18px] font-['Nunito_800ExtraBold'] text-[#0F172A] mb-4 ml-2">
          Rincian Kategori
        </Text>

        <View 
          className="bg-white rounded-[24px] p-2"
          style={{
            shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.03, shadowRadius: 10, elevation: 1,
          }}
        >
          {SPENDING_DATA.map((item, index) => (
            <View key={item.id}>
              <View className="flex-row items-center p-3">
                
                {/* Icon */}
                <View className="w-12 h-12 rounded-2xl items-center justify-center mr-4" style={{ backgroundColor: item.bg }}>
                  <MaterialCommunityIcons name={item.icon as any} size={22} color={item.color} />
                </View>

                {/* Info */}
                <View className="flex-1 justify-center">
                  <Text className="text-[15px] font-['Nunito_700Bold'] text-[#0F172A] mb-0.5">{item.name}</Text>
                  <Text className="text-[13px] font-['Nunito_600SemiBold'] text-[#64748B]">{item.percentage}% dari total</Text>
                </View>

                {/* Amount */}
                <Text className="text-[15px] font-['Nunito_800ExtraBold'] text-[#0F172A]">
                  {item.amount}
                </Text>
              </View>

              {/* Divider */}
              {index < SPENDING_DATA.length - 1 && (
                <View className="h-[1px] bg-[#F1F5F9] mx-4" />
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Modal Blur Filter */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
      >
        {/* Background Blur */}
        <BlurView 
          intensity={40} 
          tint="dark" 
          style={StyleSheet.absoluteFill} 
        />
        
        {/* Clickable Overlay to close */}
        <Pressable 
          style={StyleSheet.absoluteFill} 
          onPress={() => setIsModalVisible(false)} 
        />

        {/* Bottom Sheet Menu */}
        <View 
          className="absolute bottom-0 w-full bg-white rounded-t-[32px] pt-4 pb-8 px-6"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 10,
          }}
        >
          {/* Handle Drag bar */}
          <View className="w-12 h-1.5 bg-[#E2EAF3] rounded-full self-center mb-6" />
          
          <Text className="text-[20px] font-['Nunito_800ExtraBold'] text-[#0F172A] mb-4 text-center">
            Pilih Periode
          </Text>

          {PERIOD_OPTIONS.map((option, index) => {
            const isSelected = option === period;
            return (
              <Pressable
                key={option}
                onPress={() => {
                  setPeriod(option);
                  setIsModalVisible(false);
                }}
                className={`flex-row items-center justify-between py-4 border-b border-[#F1F5F9] ${index === PERIOD_OPTIONS.length - 1 ? 'border-b-0' : ''}`}
              >
                <Text className={`text-[16px] ${isSelected ? "font-['Nunito_800ExtraBold'] text-[#0369A1]" : "font-['Nunito_600SemiBold'] text-[#475569]"}`}>
                  {option}
                </Text>
                {isSelected && (
                  <Feather name="check" size={20} color="#0369A1" />
                )}
              </Pressable>
            );
          })}
        </View>
      </Modal>
    </View>
  );
}
