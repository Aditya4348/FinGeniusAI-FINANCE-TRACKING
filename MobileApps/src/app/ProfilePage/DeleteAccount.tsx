import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/context/AuthContext';
import { isAxiosError } from 'axios';

export default function DeleteAccountScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, deleteAccount } = useAuth();

  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleDelete = async () => {
    setErrorMessage(null);

    const trimmedPassword = password.trim();
    if (!trimmedPassword) {
      setErrorMessage('Silakan masukkan kata sandi Anda untuk konfirmasi.');
      return;
    }

    Alert.alert(
      'Konfirmasi Terakhir',
      'Apakah Anda benar-benar yakin ingin menghapus akun ini beserta seluruh data transaksi dan dompet secara permanen?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Ya, Hapus Permanen',
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true);
            try {
              await deleteAccount({ password: trimmedPassword });
              await AsyncStorage.removeItem('user_account_settings');
              Alert.alert('Akun Dihapus', 'Akun Anda dan seluruh data telah berhasil dihapus dari sistem.');
              router.replace('/login');
            } catch (error: unknown) {
              if (isAxiosError(error)) {
                const detail = error.response?.data?.detail;
                const msg =
                  typeof detail === 'string'
                    ? detail
                    : Array.isArray(detail) && detail.length > 0 && detail[0]?.msg
                    ? String(detail[0].msg)
                    : 'Kata sandi tidak sesuai. Akun tidak dapat dihapus.';
                setErrorMessage(msg);
              } else {
                setErrorMessage('Terjadi kesalahan saat menghapus akun. Silakan coba lagi.');
              }
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-[#F9FAFB]" style={{ paddingTop: insets.top }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View className="flex-row items-center px-6 pt-4 pb-4 bg-white border-b border-[#F2F2F7]">
          <Pressable
            onPress={() => router.back()}
            disabled={isDeleting}
            className="w-10 h-10 rounded-full bg-[#F2F2F7] items-center justify-center mr-4"
          >
            <Feather name="arrow-left" size={20} color="#0F172A" />
          </Pressable>
          <Text className="text-[20px] font-['Nunito_800ExtraBold'] text-[#0F172A] tracking-tight">
            Hapus Akun Permanen
          </Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: insets.bottom + 40 }}
        >
          {/* Danger Alert Hero Banner */}
          <View
            className="bg-[#FEF2F2] rounded-[24px] p-6 mb-6 border border-[#FCA5A5]/40 items-center"
            style={{ shadowColor: '#EF4444', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 2 }}
          >
            <View className="w-16 h-16 rounded-full bg-[#FEE2E2] items-center justify-center mb-4">
              <Feather name="alert-triangle" size={32} color="#DC2626" />
            </View>
            <Text className="text-[20px] font-['Nunito_800ExtraBold'] text-[#991B1B] text-center mb-1">
              Peringatan Tindakan Permanen
            </Text>
            <Text className="text-[13px] font-['Nunito_600SemiBold'] text-[#B91C1C] text-center leading-5">
              Anda sedang mengajukan penghapusan akun untuk{' '}
              <Text className="font-['Nunito_800ExtraBold']">@{user?.username || 'akun Anda'}</Text>.
              Tindakan ini tidak dapat dibatalkan atau dipulihkan kembali.
            </Text>
          </View>

          {/* Section: Apa yang akan terjadi */}
          <Text className="text-[13px] font-['Nunito_800ExtraBold'] text-[#8E8E93] mb-3 ml-2 uppercase tracking-wider">
            Apa yang akan terjadi setelah akun dihapus?
          </Text>
          <View
            className="bg-white rounded-[24px] p-5 mb-6 border border-[#F2F2F7]"
            style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 }}
          >
            {/* Item 1 */}
            <View className="flex-row items-start mb-4 pb-4 border-b border-[#F2F2F7]">
              <View className="w-10 h-10 rounded-2xl bg-[#FEF2F2] items-center justify-center mr-3.5 mt-0.5">
                <Ionicons name="wallet-outline" size={20} color="#DC2626" />
              </View>
              <View className="flex-1">
                <Text className="text-[14px] font-['Nunito_700Bold'] text-[#0F172A]">
                  Semua Dompet & Saldo Terhapus
                </Text>
                <Text className="text-[12px] font-['Nunito_600SemiBold'] text-[#64748B] mt-0.5 leading-4">
                  Daftar akun rekening bank, e-wallet, dan saldo tunai Anda akan dihapus permanen.
                </Text>
              </View>
            </View>

            {/* Item 2 */}
            <View className="flex-row items-start mb-4 pb-4 border-b border-[#F2F2F7]">
              <View className="w-10 h-10 rounded-2xl bg-[#FEF2F2] items-center justify-center mr-3.5 mt-0.5">
                <MaterialCommunityIcons name="history" size={20} color="#DC2626" />
              </View>
              <View className="flex-1">
                <Text className="text-[14px] font-['Nunito_700Bold'] text-[#0F172A]">
                  Riwayat Transaksi Dimusnahkan
                </Text>
                <Text className="text-[12px] font-['Nunito_600SemiBold'] text-[#64748B] mt-0.5 leading-4">
                  Seluruh catatan uang masuk, uang keluar, kategori, dan struk belanja akan dihilangkan dari database.
                </Text>
              </View>
            </View>

            {/* Item 3 */}
            <View className="flex-row items-start mb-4 pb-4 border-b border-[#F2F2F7]">
              <View className="w-10 h-10 rounded-2xl bg-[#FEF2F2] items-center justify-center mr-3.5 mt-0.5">
                <MaterialCommunityIcons name="robot-outline" size={20} color="#DC2626" />
              </View>
              <View className="flex-1">
                <Text className="text-[14px] font-['Nunito_700Bold'] text-[#0F172A]">
                  Pengaturan Batas Harian & AI Direset
                </Text>
                <Text className="text-[12px] font-['Nunito_600SemiBold'] text-[#64748B] mt-0.5 leading-4">
                  Kamus pemetaan kata kunci AI dan konfigurasi limit pengeluaran harian akan dibersihkan.
                </Text>
              </View>
            </View>

            {/* Item 4 */}
            <View className="flex-row items-start">
              <View className="w-10 h-10 rounded-2xl bg-[#FEF2F2] items-center justify-center mr-3.5 mt-0.5">
                <Feather name="lock" size={18} color="#DC2626" />
              </View>
              <View className="flex-1">
                <Text className="text-[14px] font-['Nunito_700Bold'] text-[#0F172A]">
                  Sesi Masuk Dicabut
                </Text>
                <Text className="text-[12px] font-['Nunito_600SemiBold'] text-[#64748B] mt-0.5 leading-4">
                  Anda akan langsung dikeluarkan dan username/email dapat digunakan kembali oleh siapa saja untuk mendaftar akun baru.
                </Text>
              </View>
            </View>
          </View>

          {/* Section: Konfirmasi Kata Sandi */}
          <Text className="text-[13px] font-['Nunito_800ExtraBold'] text-[#8E8E93] mb-3 ml-2 uppercase tracking-wider">
            Konfirmasi Kata Sandi
          </Text>
          <View
            className="bg-white rounded-[24px] p-5 mb-6 border border-[#F2F2F7]"
            style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 }}
          >
            <Text className="text-[13px] font-['Nunito_600SemiBold'] text-[#64748B] mb-3">
              Ketik kata sandi akun FinGenius Anda untuk mengonfirmasi bahwa Anda adalah pemilik sah akun ini:
            </Text>

            <View
              className={`flex-row items-center bg-[#F8FAFC] border rounded-2xl px-4 h-14 ${
                errorMessage ? 'border-[#EF4444]' : 'border-[#E2E8F0]'
              }`}
            >
              <Feather name="lock" size={18} color={errorMessage ? '#EF4444' : '#94A3B8'} style={{ marginRight: 10 }} />
              <TextInput
                value={password}
                onChangeText={(val) => {
                  setPassword(val);
                  setErrorMessage(null);
                }}
                placeholder="Masukkan kata sandi akun"
                placeholderTextColor="#94A3B8"
                secureTextEntry={!isPasswordVisible}
                autoCapitalize="none"
                editable={!isDeleting}
                className="flex-1 text-[15px] font-['Nunito_700Bold'] text-[#0F172A] p-0"
              />
              <Pressable onPress={() => setIsPasswordVisible(!isPasswordVisible)} hitSlop={12}>
                <Feather name={isPasswordVisible ? 'eye-off' : 'eye'} size={18} color="#94A3B8" />
              </Pressable>
            </View>

            {errorMessage && (
              <View className="flex-row items-center mt-3">
                <Feather name="alert-circle" size={14} color="#EF4444" style={{ marginRight: 6 }} />
                <Text className="text-[12px] font-['Nunito_600SemiBold'] text-[#EF4444] flex-1">
                  {errorMessage}
                </Text>
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View className="gap-3">
            <Pressable
              onPress={handleDelete}
              disabled={isDeleting}
              className="w-full py-4 rounded-2xl bg-[#DC2626] items-center justify-center flex-row"
              style={{
                opacity: isDeleting ? 0.7 : 1,
                shadowColor: '#DC2626',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.25,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              {isDeleting && <ActivityIndicator size="small" color="#ffffff" style={{ marginRight: 8 }} />}
              <Text className="text-[15px] font-['Nunito_800ExtraBold'] text-white">
                {isDeleting ? 'Menghapus Akun...' : 'Hapus Akun Saya Secara Permanen'}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => router.back()}
              disabled={isDeleting}
              className="w-full py-3.5 rounded-2xl bg-[#F1F5F9] items-center justify-center"
            >
              <Text className="text-[14px] font-['Nunito_700Bold'] text-[#64748B]">
                Batal & Kembali ke Pengaturan
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
