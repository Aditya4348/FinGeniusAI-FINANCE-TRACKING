import { View, Text, ScrollView, Image, Pressable } from 'react-native';
import { Feather, Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileScreen() {
  const router = useRouter();

  const MenuItem = ({ icon, label, color, isDestructive = false }: { icon: any, label: string, color: string, isDestructive?: boolean }) => (
    <Pressable className="flex-row items-center justify-between py-4 border-b border-[#F2F2F7]">
      <View className="flex-row items-center">
        <View className="w-8 h-8 rounded-full items-center justify-center mr-3" style={{ backgroundColor: color + '15' }}>
          {icon}
        </View>
        <Text className={`text-[15px] font-['Nunito_700Bold'] ${isDestructive ? 'text-[#FF3B30]' : 'text-black'}`}>
          {label}
        </Text>
      </View>
      <Feather name="chevron-right" size={20} color="#C7C7CC" />
    </Pressable>
  );

  return (
    <View className="flex-1 bg-[#F9FAFB]">
      
      {/* Header Blue Background */}
      <View className="bg-[#0369A1] pt-14 pb-[100px] px-6 rounded-b-[40px] absolute w-full top-0">
        <View className="flex-row items-center justify-between mb-6">
          <Pressable onPress={() => router.back()} className="w-10 h-10 rounded-full bg-white/20 justify-center items-center">
            <Feather name="arrow-left" size={24} color="white" />
          </Pressable>
          <Text className="text-white text-lg font-['Nunito_800ExtraBold']">Profil</Text>
          <View className="w-10 h-10" />
        </View>

        {/* Profile Info */}
        <View className="flex-row items-center">
          <View className="relative">
            <View className="w-[72px] h-[72px] rounded-full border-2 border-white overflow-hidden mr-4 bg-[#F2F2F7]">
              <Image 
                source={{ uri: 'https://i.pravatar.cc/150?img=11' }} 
                className="w-full h-full" 
              />
            </View>
            <View className="absolute bottom-0 right-3 bg-[#8B5CF6] px-2 py-0.5 rounded-full border border-white">
              <Text className="text-[9px] font-['Nunito_800ExtraBold'] text-white">PRO</Text>
            </View>
          </View>
          
          <View className="flex-1">
            <Text className="text-white text-[19px] font-['Nunito_800ExtraBold'] tracking-wide">ADITYA ALFITODINOVA</Text>
            <Text className="text-white/80 text-[14px] font-['Nunito_600SemiBold'] mt-0.5">0812 •••• 8899</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 mt-[180px]" showsVerticalScrollIndicator={false} contentContainerClassName="px-5 pb-10">
        
        {/* Floating Middle Card */}
        <View className="bg-white rounded-3xl p-5 shadow-sm elevation-sm mb-6 border border-[#F2F2F7]">
          
          {/* Quick Actions Grid */}
          <View className="flex-row justify-between mb-6 pt-2">
            <Pressable className="items-center w-[22%]">
              <View className="w-12 h-12 rounded-2xl bg-[#F5F3FF] items-center justify-center mb-2">
                <FontAwesome5 name="magic" size={20} color="#8B5CF6" />
              </View>
              <Text className="text-[11px] font-['Nunito_700Bold'] text-black text-center leading-tight">Pengaturan AI</Text>
            </Pressable>

            <Pressable className="items-center w-[22%]">
              <View className="w-12 h-12 rounded-2xl bg-[#EFF8FF] items-center justify-center mb-2">
                <Ionicons name="wallet" size={24} color="#0284C7" />
              </View>
              <Text className="text-[11px] font-['Nunito_700Bold'] text-black text-center leading-tight">Sumber Dana</Text>
            </Pressable>

            <Pressable className="items-center w-[22%]">
              <View className="w-12 h-12 rounded-2xl bg-[#FFF4ED] items-center justify-center mb-2">
                <MaterialIcons name="track-changes" size={24} color="#EA580C" />
              </View>
              <Text className="text-[11px] font-['Nunito_700Bold'] text-black text-center leading-tight">Batas Harian</Text>
            </Pressable>

            <Pressable className="items-center w-[22%]">
              <View className="w-12 h-12 rounded-2xl bg-[#ECFDF3] items-center justify-center mb-2">
                <Ionicons name="pie-chart" size={22} color="#027A48" />
              </View>
              <Text className="text-[11px] font-['Nunito_700Bold'] text-black text-center leading-tight">Kategori</Text>
            </Pressable>
          </View>

          <View className="h-[1px] bg-[#F2F2F7] w-full mb-4" />

          {/* Cashflow Summary */}
          <View className="flex-row justify-between">
            <View className="flex-row items-center flex-1 border-r border-[#F2F2F7]">
              <View className="w-8 h-8 rounded-full bg-[#ECFDF3] items-center justify-center mr-3">
                <Feather name="arrow-down-left" size={18} color="#027A48" />
              </View>
              <View>
                <Text className="text-[11px] font-['Nunito_600SemiBold'] text-[#8E8E93]">Uang Masuk</Text>
                <Text className="text-[14px] font-['Nunito_800ExtraBold'] text-black">Rp 5.250.000</Text>
              </View>
            </View>
            <View className="flex-row items-center flex-1 pl-4">
              <View className="w-8 h-8 rounded-full bg-[#FFF4ED] items-center justify-center mr-3">
                <Feather name="arrow-up-right" size={18} color="#EA580C" />
              </View>
              <View>
                <Text className="text-[11px] font-['Nunito_600SemiBold'] text-[#8E8E93]">Uang Keluar</Text>
                <Text className="text-[14px] font-['Nunito_800ExtraBold'] text-black">Rp 1.487.379</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Settings List */}
        <View className="bg-white rounded-3xl p-5 shadow-sm elevation-sm border border-[#F2F2F7]">
          <Text className="text-[13px] font-['Nunito_800ExtraBold'] text-[#8E8E93] mb-2 uppercase tracking-wider">Pengaturan</Text>
          
          <MenuItem 
            icon={<Feather name="user" size={16} color="#0369A1" />}
            label="Pengaturan Akun"
            color="#0369A1"
          />
          <MenuItem 
            icon={<Feather name="shield" size={16} color="#059669" />}
            label="Keamanan & Privasi"
            color="#059669"
          />
          <MenuItem 
            icon={<Feather name="bell" size={16} color="#D97706" />}
            label="Notifikasi"
            color="#D97706"
          />
          <MenuItem 
            icon={<Feather name="help-circle" size={16} color="#4B5563" />}
            label="Bantuan & Dukungan"
            color="#4B5563"
          />
          
          <View className="mt-4 border-t border-[#F2F2F7] pt-2">
            <MenuItem 
              icon={<Feather name="log-out" size={16} color="#FF3B30" />}
              label="Keluar Aplikasi"
              color="#FF3B30"
              isDestructive={true}
            />
          </View>
        </View>

      </ScrollView>
    </View>
  );
}
