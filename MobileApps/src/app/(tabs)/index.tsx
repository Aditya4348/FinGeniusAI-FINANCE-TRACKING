import { View, Text, ScrollView, Image, Pressable, Modal, TextInput, Alert, StyleSheet } from 'react-native';
import { GradientCard, CapitalCard, TransactionItem, DailyBudgetCard } from '@/components/FinanceUI';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { BlurView } from 'expo-blur';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRupiahInput } from '@/hooks/useRupiahInput';
import { LinearGradient } from 'expo-linear-gradient';

export default function OverviewScreen() {
  const router = useRouter();
  const [isCensored, setIsCensored] = useState(false);
  
  // Top Up Modal State
  const [isTopUpModalVisible, setIsTopUpModalVisible] = useState(false);
  const topUpAmount = useRupiahInput('');
  const [topUpNote, setTopUpNote] = useState('');
  const [selectedWalletId, setSelectedWalletId] = useState('');
  const [wallets, setWallets] = useState<any[]>([]);

  useEffect(() => {
    // Muat daftar rekening saat modal akan dibuka atau screen dimuat
    if (isTopUpModalVisible) {
      loadWallets();
    }
  }, [isTopUpModalVisible]);

  const loadWallets = async () => {
    try {
      const stored = await AsyncStorage.getItem('user_wallets');
      if (stored) {
        const parsed = JSON.parse(stored);
        setWallets(parsed);
        if (parsed.length > 0 && !selectedWalletId) {
          setSelectedWalletId(parsed[0].id);
        }
      }
    } catch (e) {
      console.log('Error loading wallets');
    }
  };

  const handleTopUp = async () => {
    if (!topUpAmount.rawValue || !selectedWalletId) {
      Alert.alert('Gagal', 'Masukkan nominal dan pilih dompet tujuan.');
      return;
    }

    try {
      // 1. Ambil data dompet terbaru
      const stored = await AsyncStorage.getItem('user_wallets');
      if (!stored) return;
      let currentWallets = JSON.parse(stored);

      // 2. Cari dompet yang dipilih dan tambahkan saldonya
      const amountToAdd = parseInt(topUpAmount.rawValue, 10);
      let walletName = '';

      currentWallets = currentWallets.map((wallet: any) => {
        if (wallet.id === selectedWalletId) {
          walletName = wallet.name;
          // Ekstrak angka dari "Rp 14.500.000"
          const currentBalanceStr = wallet.balance.replace(/[^0-9]/g, '');
          const currentBalance = parseInt(currentBalanceStr || '0', 10);
          
          const newBalance = currentBalance + amountToAdd;
          wallet.balance = `Rp ${newBalance.toLocaleString('id-ID')}`;
        }
        return wallet;
      });

      // 3. Simpan kembali ke AsyncStorage
      await AsyncStorage.setItem('user_wallets', JSON.stringify(currentWallets));

      // 4. Tutup modal & Reset
      Alert.alert('Berhasil!', `Rp ${amountToAdd.toLocaleString('id-ID')} berhasil ditambahkan ke ${walletName}.`);
      setIsTopUpModalVisible(false);
      topUpAmount.reset();
      setTopUpNote('');

    } catch (e) {
      Alert.alert('Error', 'Terjadi kesalahan saat menyimpan.');
    }
  };

  const censor = (val: string) => isCensored ? 'Rp ***.***' : val;
  const censorTx = (val: string) => isCensored ? (val.startsWith('-') ? '-Rp ***' : '+Rp ***') : val;

  return (
    <View className="flex-1 bg-[#F9FAFB]">
      <ScrollView className="flex-1" contentContainerClassName="p-6 pt-[60px]">
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
          <Pressable onPress={() => router.push('/ProfilePage/LimitDay')}>
            <DailyBudgetCard remaining={censor("Rp 45.000")} total={censor("Rp 100.000")} percentage={45} />
          </Pressable>
          
          <GradientCard 
            balance={censor("Rp 5.827.400")} 
            title="Saldo Utama" 
            onTopUpPress={() => setIsTopUpModalVisible(true)}
          />

          <Pressable onPress={() => router.push('/wallet')}>
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

      {/* MODAL ISI SALDO */}
      <Modal visible={isTopUpModalVisible} transparent={true} animationType="slide">
        <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
        
        <Pressable 
          style={StyleSheet.absoluteFill} 
          onPress={() => setIsTopUpModalVisible(false)} 
        />

        <View className="absolute bottom-0 w-full bg-white rounded-t-[32px] pt-4 pb-8 px-6 shadow-xl">
          <View className="w-12 h-1.5 bg-[#E2EAF3] rounded-full self-center mb-6" />
          
          <Text className="text-[20px] font-['Nunito_800ExtraBold'] text-[#0F172A] mb-5 text-center">
            Isi Saldo (Pemasukan)
          </Text>

          {/* Nominal Input */}
          <Text className="text-[12px] font-['Nunito_700Bold'] text-[#374151] mb-1.5 ml-1">Nominal</Text>
          <View className="bg-[#F9FAFB] rounded-2xl px-4 mb-4 border border-[#E5E7EB] h-[52px] justify-center">
            <TextInput
              value={topUpAmount.value}
              onChangeText={topUpAmount.onChangeText}
              keyboardType="numeric"
              placeholder="Contoh: Rp 5.000.000"
              className="flex-1 text-[18px] font-['Nunito_800ExtraBold'] text-[#111827]"
            />
          </View>

          {/* Note Input */}
          <Text className="text-[12px] font-['Nunito_700Bold'] text-[#374151] mb-1.5 ml-1">Keterangan</Text>
          <View className="bg-[#F9FAFB] rounded-2xl px-4 mb-5 border border-[#E5E7EB] h-[52px] justify-center">
            <TextInput
              value={topUpNote}
              onChangeText={setTopUpNote}
              placeholder="Contoh: Gaji Bulanan, Bonus"
              className="flex-1 text-[15px] font-['Nunito_600SemiBold'] text-[#111827]"
            />
          </View>

          {/* Wallet Selector */}
          <Text className="text-[12px] font-['Nunito_700Bold'] text-[#374151] mb-2 ml-1">Simpan Ke Rekening</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
            <View className="flex-row gap-3">
              {wallets.length === 0 ? (
                <Text className="text-sm text-[#8E8E93] italic">Belum ada rekening di Dompet.</Text>
              ) : (
                wallets.map((wallet) => (
                  <Pressable
                    key={wallet.id}
                    onPress={() => setSelectedWalletId(wallet.id)}
                    className={`flex-row items-center px-4 py-3 rounded-2xl border ${selectedWalletId === wallet.id ? 'bg-[#EFF6FF] border-[#3B82F6]' : 'bg-white border-[#E5E7EB]'}`}
                  >
                    <View className="w-8 h-8 rounded-full bg-[#F1F5F9] items-center justify-center mr-2">
                      <MaterialCommunityIcons name={wallet.icon} size={16} color={selectedWalletId === wallet.id ? '#1D4ED8' : '#64748B'} />
                    </View>
                    <View>
                      <Text className={`text-[13px] font-['Nunito_800ExtraBold'] ${selectedWalletId === wallet.id ? 'text-[#1D4ED8]' : 'text-[#333]'}`}>{wallet.name}</Text>
                      <Text className="text-[11px] text-[#64748B] font-['Nunito_600SemiBold']">{wallet.balance}</Text>
                    </View>
                  </Pressable>
                ))
              )}
            </View>
          </ScrollView>

          {/* Submit Button */}
          <Pressable onPress={handleTopUp} disabled={wallets.length === 0}>
            <LinearGradient
              colors={wallets.length === 0 ? ['#94A3B8', '#64748B'] : ['#0369A1', '#0284C7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="rounded-2xl h-[52px] items-center justify-center"
            >
              <Text className="text-white text-[16px] font-['Nunito_800ExtraBold']">
                Konfirmasi Pemasukan
              </Text>
            </LinearGradient>
          </Pressable>
        </View>
      </Modal>

    </View>
  );
}