import { View, Text, ScrollView, Pressable, Switch, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useRupiahInput } from '@/hooks/useRupiahInput';
import { LinearGradient } from 'expo-linear-gradient';

export default function LimitDayScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  // State Prototype
  const [isLimitEnabled, setIsLimitEnabled] = useState(true);
  const limitInput = useRupiahInput('100000'); 
  
  // Settings Toggles
  const [warnAt80, setWarnAt80] = useState(true);
  const [warnAt100, setWarnAt100] = useState(true);
  const [strictMode, setStrictMode] = useState(false);

  // Simulasi Visual Progress (Untuk UI Prototype)
  const simulatedUsed = 75000;
  const limitValue = limitInput.rawValue ? parseInt(limitInput.rawValue, 10) : 100000;
  const percentage = Math.min((simulatedUsed / limitValue) * 100, 100) || 0;
  
  // Logika Warna Progress Bar
  let progressColor = '#10B981'; // Hijau
  if (percentage >= 80) progressColor = '#EF4444'; // Merah
  else if (percentage >= 50) progressColor = '#F59E0B'; // Kuning

  return (
    <View className="flex-1 bg-[#EEF3F9]" style={{ paddingTop: insets.top }}>
      
      {/* Header */}
      <View className="flex-row items-center px-6 pt-4 pb-4">
        <Pressable 
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-white items-center justify-center border border-[#E2EAF3] mr-4"
        >
          <Feather name="arrow-left" size={20} color="#0F172A" />
        </Pressable>
        <Text className="text-[22px] font-['Nunito_800ExtraBold'] text-[#0F172A] tracking-tight">Batas Harian</Text>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
      >
        
        {/* Master Toggle Card */}
        <View className="bg-white rounded-[24px] p-5 mb-6 flex-row items-center justify-between"
          style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 }}
        >
          <View className="flex-row items-center flex-1 pr-4">
            <View className={`w-12 h-12 rounded-2xl items-center justify-center mr-4 ${isLimitEnabled ? 'bg-[#EFF6FF]' : 'bg-[#F1F5F9]'}`}>
              <Ionicons name="shield-checkmark" size={24} color={isLimitEnabled ? '#3B82F6' : '#94A3B8'} />
            </View>
            <View className="flex-1">
              <Text className="text-[16px] font-['Nunito_800ExtraBold'] text-[#0F172A] mb-0.5">Aktifkan Batas</Text>
              <Text className="text-[13px] font-['Nunito_600SemiBold'] text-[#64748B]">Cegah pengeluaran berlebih</Text>
            </View>
          </View>
          <Switch 
            value={isLimitEnabled} 
            onValueChange={setIsLimitEnabled} 
            trackColor={{ false: '#E2EAF3', true: '#3B82F6' }}
            thumbColor={'#ffffff'}
          />
        </View>

        {isLimitEnabled && (
          <View className="animate-fade-in">
            
            {/* Tombol AI Generator */}
            <Pressable 
              onPress={() => router.push('/ProfilePage/LimitDayWizard')}
              className="mb-6 rounded-[20px] p-1 overflow-hidden"
            >
              <LinearGradient
                colors={['#8B5CF6', '#6D28D9']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="rounded-[16px] px-5 py-4 flex-row items-center justify-between"
              >
                <View className="flex-row items-center flex-1">
                  <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center mr-3">
                    <MaterialCommunityIcons name="auto-fix" size={20} color="white" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-[15px] font-['Nunito_800ExtraBold'] text-white mb-0.5">Atur Otomatis dengan AI</Text>
                    <Text className="text-[12px] font-['Nunito_600SemiBold'] text-white/80">Kalkulasi ideal berdasarkan data Anda</Text>
                  </View>
                </View>
                <Feather name="chevron-right" size={20} color="white" />
              </LinearGradient>
            </Pressable>

            {/* Atau Input Manual */}
            <View className="flex-row items-center justify-center mb-4">
              <View className="flex-1 h-[1px] bg-[#E2EAF3]" />
              <Text className="text-[12px] font-['Nunito_700Bold'] text-[#94A3B8] mx-3">ATAU INPUT MANUAL</Text>
              <View className="flex-1 h-[1px] bg-[#E2EAF3]" />
            </View>

            {/* Input Nominal Batas */}
            <Text className="text-[14px] font-['Nunito_700Bold'] text-[#374151] mb-2 ml-2">Anggaran Maksimal (Harian)</Text>
            <View className="bg-white rounded-2xl px-5 mb-6 h-[64px] justify-center"
              style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 }}
            >
              <TextInput
                value={limitInput.value}
                onChangeText={limitInput.onChangeText}
                keyboardType="numeric"
                placeholder="Rp 0"
                className="flex-1 text-[22px] font-['Nunito_800ExtraBold'] text-[#111827]"
              />
            </View>

            {/* Visualisasi Progress */}
            <View className="bg-white rounded-[24px] p-6 mb-6"
              style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 2 }}
            >
              <View className="flex-row justify-between items-end mb-4">
                <View>
                  <Text className="text-[13px] font-['Nunito_600SemiBold'] text-[#64748B] mb-1">Terpakai Hari Ini</Text>
                  <Text className="text-[24px] font-['Nunito_800ExtraBold'] text-[#0F172A]">
                    Rp {simulatedUsed.toLocaleString('id-ID')}
                  </Text>
                </View>
                <View className={`px-2.5 py-1 rounded-lg ${percentage >= 80 ? 'bg-[#FEF2F2]' : 'bg-[#F0FDF4]'}`}>
                  <Text className={`text-[12px] font-['Nunito_800ExtraBold'] ${percentage >= 80 ? 'text-[#EF4444]' : 'text-[#10B981]'}`}>
                    {percentage.toFixed(0)}%
                  </Text>
                </View>
              </View>

              {/* Progress Bar */}
              <View className="h-3 w-full bg-[#F1F5F9] rounded-full overflow-hidden">
                <View 
                  className="h-full rounded-full" 
                  style={{ width: `${percentage}%`, backgroundColor: progressColor }} 
                />
              </View>
              <Text className="text-[12px] font-['Nunito_600SemiBold'] text-[#94A3B8] mt-3 text-right">
                Sisa: Rp {(Math.max(limitValue - simulatedUsed, 0)).toLocaleString('id-ID')}
              </Text>
            </View>

            {/* Pengaturan Peringatan */}
            <Text className="text-[14px] font-['Nunito_700Bold'] text-[#374151] mb-2 ml-2">Pengaturan Notifikasi</Text>
            <View className="bg-white rounded-[24px] p-2 mb-6"
              style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 }}
            >
              {/* Toggle 80% */}
              <View className="flex-row items-center justify-between p-4 border-b border-[#F1F5F9]">
                <View className="flex-row items-center flex-1 pr-4">
                  <View className="w-10 h-10 rounded-full bg-[#FFFBEB] items-center justify-center mr-3">
                    <Feather name="bell" size={18} color="#F59E0B" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-[15px] font-['Nunito_700Bold'] text-[#0F172A]">Ingatkan di 80%</Text>
                    <Text className="text-[12px] font-['Nunito_600SemiBold'] text-[#64748B]">Kirim notifikasi peringatan</Text>
                  </View>
                </View>
                <Switch value={warnAt80} onValueChange={setWarnAt80} trackColor={{ false: '#E2EAF3', true: '#3B82F6' }} thumbColor={'#ffffff'} />
              </View>

              {/* Toggle 100% */}
              <View className="flex-row items-center justify-between p-4 border-b border-[#F1F5F9]">
                <View className="flex-row items-center flex-1 pr-4">
                  <View className="w-10 h-10 rounded-full bg-[#FEF2F2] items-center justify-center mr-3">
                    <Feather name="alert-circle" size={18} color="#EF4444" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-[15px] font-['Nunito_700Bold'] text-[#0F172A]">Ingatkan di 100%</Text>
                    <Text className="text-[12px] font-['Nunito_600SemiBold'] text-[#64748B]">Saat batas harian terlewati</Text>
                  </View>
                </View>
                <Switch value={warnAt100} onValueChange={setWarnAt100} trackColor={{ false: '#E2EAF3', true: '#3B82F6' }} thumbColor={'#ffffff'} />
              </View>

              {/* Strict Mode */}
              <View className="flex-row items-center justify-between p-4">
                <View className="flex-row items-center flex-1 pr-4">
                  <View className="w-10 h-10 rounded-full bg-[#F3E8FF] items-center justify-center mr-3">
                    <MaterialCommunityIcons name="robot-outline" size={20} color="#9333EA" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-[15px] font-['Nunito_700Bold'] text-[#0F172A]">Mode AI Ketat (Hard Stop)</Text>
                    <Text className="text-[12px] font-['Nunito_600SemiBold'] text-[#64748B]">AI akan menolak pengeluaran baru</Text>
                  </View>
                </View>
                <Switch value={strictMode} onValueChange={setStrictMode} trackColor={{ false: '#E2EAF3', true: '#9333EA' }} thumbColor={'#ffffff'} />
              </View>
            </View>

            {/* Tombol Simpan */}
            <Pressable>
              <LinearGradient
                colors={['#0369A1', '#0284C7']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="rounded-2xl h-[56px] items-center justify-center"
              >
                <Text className="text-white text-[16px] font-['Nunito_800ExtraBold']">
                  Simpan Pengaturan
                </Text>
              </LinearGradient>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </View>
  );
}