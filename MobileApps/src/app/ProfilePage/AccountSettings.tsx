import { View, Text, ScrollView, Pressable, Switch, Image, TextInput, Modal, Alert, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserAccountSettings {
  name: string;
  username: string;
  email: string;
  phone: string;
  job: string;
  payday: number;
  currency: string;
  balanceFormat: string;
  autoBackup: boolean;
  lastBackupDate: string;
  avatarUri: string;
}

const DEFAULT_SETTINGS: UserAccountSettings = {
  name: 'Aditya Alfitodinova',
  username: 'aditya.alfitodinova',
  email: 'aditya.alfitodinova@gmail.com',
  phone: '0812 •••• 8899',
  job: 'Software Engineer / Tech',
  payday: 25,
  currency: 'IDR (Rp) - Rupiah Indonesia',
  balanceFormat: 'Lengkap (Rp 1.500.000)',
  autoBackup: true,
  lastBackupDate: 'Hari ini, 14:20 WIB',
  avatarUri: 'https://i.pravatar.cc/150?img=11',
};

const JOB_OPTIONS = [
  'Software Engineer / Tech',
  'Karyawan Swasta',
  'Pegawai Negeri / BUMN',
  'Wirausaha / Bisnis',
  'Freelancer / Kreatif',
  'Mahasiswa / Pelajar',
  'Lainnya',
];

const BALANCE_FORMAT_OPTIONS = [
  'Lengkap (Rp 1.500.000)',
  'Ringkas (Rp 1,5 Jt)',
  'Minimalis (1.500.000)',
];

export default function AccountSettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Settings State
  const [settings, setSettings] = useState<UserAccountSettings>(DEFAULT_SETTINGS);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Edit Modal State
  const [modalType, setModalType] = useState<
    'name' | 'username' | 'email' | 'phone' | 'job' | 'payday' | 'balanceFormat' | 'avatar' | null
  >(null);
  const [editValue, setEditValue] = useState('');

  // Load from Storage
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const stored = await AsyncStorage.getItem('user_account_settings');
      if (stored) {
        setSettings(JSON.parse(stored));
      }
    } catch {
      // fallback to default
    }
  };

  const saveSettings = async (newSettings: UserAccountSettings) => {
    try {
      setSettings(newSettings);
      await AsyncStorage.setItem('user_account_settings', JSON.stringify(newSettings));
      showToast('Perubahan berhasil disimpan');
    } catch {
      Alert.alert('Gagal', 'Terjadi kesalahan saat menyimpan pengaturan.');
    }
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Open Edit Modal
  const openEdit = (
    type: 'name' | 'username' | 'email' | 'phone' | 'job' | 'payday' | 'balanceFormat' | 'avatar',
    currentVal: string
  ) => {
    setModalType(type);
    setEditValue(currentVal);
  };

  const handleSaveModal = () => {
    if (!modalType) return;

    if (modalType === 'payday') {
      const dayNum = parseInt(editValue, 10);
      if (isNaN(dayNum) || dayNum < 1 || dayNum > 31) {
        Alert.alert('Tanggal Tidak Valid', 'Silakan masukkan tanggal antara 1 sampai 31.');
        return;
      }
      saveSettings({ ...settings, payday: dayNum });
    } else if (modalType === 'name') {
      if (!editValue.trim()) {
        Alert.alert('Perhatian', 'Nama lengkap tidak boleh kosong.');
        return;
      }
      saveSettings({ ...settings, name: editValue.trim() });
    } else if (modalType === 'username') {
      if (!editValue.trim()) {
        Alert.alert('Perhatian', 'Username tidak boleh kosong.');
        return;
      }
      saveSettings({ ...settings, username: editValue.trim().toLowerCase().replace(/\s+/g, '') });
    } else if (modalType === 'email') {
      if (!editValue.includes('@')) {
        Alert.alert('Email Tidak Valid', 'Pastikan format email sudah benar.');
        return;
      }
      saveSettings({ ...settings, email: editValue.trim() });
    } else if (modalType === 'phone') {
      if (!editValue.trim()) {
        Alert.alert('Perhatian', 'Nomor handphone tidak boleh kosong.');
        return;
      }
      saveSettings({ ...settings, phone: editValue.trim() });
    } else if (modalType === 'job') {
      saveSettings({ ...settings, job: editValue });
    } else if (modalType === 'balanceFormat') {
      saveSettings({ ...settings, balanceFormat: editValue });
    } else if (modalType === 'avatar') {
      saveSettings({ ...settings, avatarUri: editValue });
    }

    setModalType(null);
  };

  const handleBackupNow = () => {
    setIsBackingUp(true);
    setTimeout(async () => {
      const now = new Date();
      const timeStr = `Hari ini, ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} WIB`;
      const updated = { ...settings, lastBackupDate: timeStr };
      await saveSettings(updated);
      setIsBackingUp(false);
      showToast('Cadangan data berhasil diperbarui ke Cloud');
    }, 1200);
  };

  const handleExportData = () => {
    Alert.alert(
      'Ekspor Data Keuangan',
      'Pilih format file laporan transaksi Anda:',
      [
        {
          text: 'Excel (.xlsx)',
          onPress: () => {
            showToast('Laporan Excel berhasil diunduh ke folder Dokumen');
          },
        },
        {
          text: 'PDF Ringkasan',
          onPress: () => {
            showToast('Laporan PDF berhasil diunduh ke folder Dokumen');
          },
        },
        { text: 'Batal', style: 'cancel' },
      ]
    );
  };

  const handleResetData = () => {
    Alert.alert(
      'Reset Data Transaksi?',
      'Semua riwayat uang masuk, uang keluar, dan saldo dompet akan dikembalikan ke kondisi awal. Tindakan ini tidak dapat dibatalkan.',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Ya, Reset',
          style: 'destructive',
          onPress: () => {
            showToast('Semua data transaksi berhasil di-reset');
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Hapus Akun Permanen?',
      'Apakah Anda yakin ingin menghapus akun ini secara permanen? Semua data finansial, preferensi, dan akun terhubung akan dihapus dari server kami.',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus Akun',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.clear();
            router.replace('/login');
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-[#F9FAFB]" style={{ paddingTop: insets.top }}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <View 
          className="absolute top-12 left-6 right-6 z-50 bg-[#0F172A] px-4 py-3 rounded-2xl flex-row items-center justify-center"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 10,
            elevation: 8,
          }}
        >
          <Ionicons name="checkmark-circle" size={18} color="#10B981" />
          <Text className="text-white text-[13px] font-['Nunito_700Bold'] ml-2 text-center">
            {toastMessage}
          </Text>
        </View>
      )}

      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pt-4 pb-4 bg-white border-b border-[#F2F2F7]">
        <View className="flex-row items-center">
          <Pressable 
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-[#F2F2F7] items-center justify-center mr-4"
          >
            <Feather name="arrow-left" size={20} color="#0F172A" />
          </Pressable>
          <Text className="text-[20px] font-['Nunito_800ExtraBold'] text-[#0F172A] tracking-tight">
            Pengaturan Akun
          </Text>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 60 }}
      >
        
        {/* Avatar Profile Card */}
        <View 
          className="bg-white rounded-[24px] p-6 mb-5 items-center border border-[#F2F2F7]"
          style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 }}
        >
          <View className="relative mb-3">
            <View className="w-24 h-24 rounded-full border-4 border-[#EFF6FF] overflow-hidden bg-[#F2F2F7]">
              <Image 
                source={{ uri: settings.avatarUri }} 
                className="w-full h-full" 
              />
            </View>
            <Pressable 
              onPress={() => openEdit('avatar', settings.avatarUri)}
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#0284C7] items-center justify-center border-2 border-white"
            >
              <Feather name="camera" size={14} color="white" />
            </Pressable>
          </View>

          <Text className="text-[19px] font-['Nunito_800ExtraBold'] text-[#0F172A] tracking-wide text-center">
            {settings.name}
          </Text>
          <Text className="text-[13px] font-['Nunito_600SemiBold'] text-[#64748B] mt-0.5">
            @{settings.username}
          </Text>

          <View className="flex-row items-center mt-3 gap-2">
            <View className="bg-[#8B5CF6]/10 px-3 py-1 rounded-full border border-[#8B5CF6]/20 flex-row items-center">
              <FontAwesome5 name="crown" size={11} color="#8B5CF6" />
              <Text className="text-[11px] font-['Nunito_800ExtraBold'] text-[#8B5CF6] ml-1.5">MEMBER PRO</Text>
            </View>
            <View className="bg-[#10B981]/10 px-3 py-1 rounded-full border border-[#10B981]/20 flex-row items-center">
              <Ionicons name="checkmark-circle" size={13} color="#10B981" />
              <Text className="text-[11px] font-['Nunito_800ExtraBold'] text-[#059669] ml-1">Terverifikasi</Text>
            </View>
          </View>

          <Text className="text-[11px] font-['Nunito_600SemiBold'] text-[#94A3B8] mt-3">
            Bergabung sejak Agustus 2026
          </Text>
        </View>

        {/* Section 1: Informasi Pribadi */}
        <Text className="text-[13px] font-['Nunito_800ExtraBold'] text-[#8E8E93] mb-2.5 ml-2 uppercase tracking-wider">
          Informasi Pribadi
        </Text>
        <View 
          className="bg-white rounded-[24px] p-4 mb-6 border border-[#F2F2F7]"
          style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 }}
        >
          {/* Nama Lengkap */}
          <Pressable 
            onPress={() => openEdit('name', settings.name)}
            className="flex-row items-center justify-between py-3.5 border-b border-[#F2F2F7]"
          >
            <View className="flex-row items-center flex-1 pr-3">
              <View className="w-9 h-9 rounded-xl bg-[#EFF6FF] items-center justify-center mr-3">
                <Feather name="user" size={17} color="#0284C7" />
              </View>
              <View className="flex-1">
                <Text className="text-[11px] font-['Nunito_600SemiBold'] text-[#8E8E93]">Nama Lengkap</Text>
                <Text className="text-[14px] font-['Nunito_700Bold'] text-[#0F172A] mt-0.5">{settings.name}</Text>
              </View>
            </View>
            <Feather name="chevron-right" size={18} color="#C7C7CC" />
          </Pressable>

          {/* Username */}
          <Pressable 
            onPress={() => openEdit('username', settings.username)}
            className="flex-row items-center justify-between py-3.5 border-b border-[#F2F2F7]"
          >
            <View className="flex-row items-center flex-1 pr-3">
              <View className="w-9 h-9 rounded-xl bg-[#F5F3FF] items-center justify-center mr-3">
                <Feather name="at-sign" size={17} color="#8B5CF6" />
              </View>
              <View className="flex-1">
                <Text className="text-[11px] font-['Nunito_600SemiBold'] text-[#8E8E93]">Username</Text>
                <Text className="text-[14px] font-['Nunito_700Bold'] text-[#0F172A] mt-0.5">@{settings.username}</Text>
              </View>
            </View>
            <Feather name="chevron-right" size={18} color="#C7C7CC" />
          </Pressable>

          {/* Email */}
          <Pressable 
            onPress={() => openEdit('email', settings.email)}
            className="flex-row items-center justify-between py-3.5 border-b border-[#F2F2F7]"
          >
            <View className="flex-row items-center flex-1 pr-3">
              <View className="w-9 h-9 rounded-xl bg-[#ECFDF5] items-center justify-center mr-3">
                <Feather name="mail" size={17} color="#10B981" />
              </View>
              <View className="flex-1">
                <Text className="text-[11px] font-['Nunito_600SemiBold'] text-[#8E8E93]">Email Terdaftar</Text>
                <Text className="text-[14px] font-['Nunito_700Bold'] text-[#0F172A] mt-0.5" numberOfLines={1}>{settings.email}</Text>
              </View>
            </View>
            <Feather name="chevron-right" size={18} color="#C7C7CC" />
          </Pressable>

          {/* Nomor Handphone */}
          <Pressable 
            onPress={() => openEdit('phone', settings.phone)}
            className="flex-row items-center justify-between py-3.5 border-b border-[#F2F2F7]"
          >
            <View className="flex-row items-center flex-1 pr-3">
              <View className="w-9 h-9 rounded-xl bg-[#FFF4ED] items-center justify-center mr-3">
                <Feather name="phone" size={17} color="#EA580C" />
              </View>
              <View className="flex-1">
                <Text className="text-[11px] font-['Nunito_600SemiBold'] text-[#8E8E93]">Nomor Handphone</Text>
                <Text className="text-[14px] font-['Nunito_700Bold'] text-[#0F172A] mt-0.5">{settings.phone}</Text>
              </View>
            </View>
            <Feather name="chevron-right" size={18} color="#C7C7CC" />
          </Pressable>

          {/* Pekerjaan / Sektor */}
          <Pressable 
            onPress={() => openEdit('job', settings.job)}
            className="flex-row items-center justify-between py-3.5"
          >
            <View className="flex-row items-center flex-1 pr-3">
              <View className="w-9 h-9 rounded-xl bg-[#F0FDF4] items-center justify-center mr-3">
                <Feather name="briefcase" size={17} color="#059669" />
              </View>
              <View className="flex-1">
                <Text className="text-[11px] font-['Nunito_600SemiBold'] text-[#8E8E93]">Bidang Pekerjaan</Text>
                <Text className="text-[14px] font-['Nunito_700Bold'] text-[#0F172A] mt-0.5">{settings.job}</Text>
              </View>
            </View>
            <Feather name="chevron-right" size={18} color="#C7C7CC" />
          </Pressable>
        </View>

        {/* Section 2: Preferensi Finansial */}
        <Text className="text-[13px] font-['Nunito_800ExtraBold'] text-[#8E8E93] mb-2.5 ml-2 uppercase tracking-wider">
          Preferensi Finansial & Anggaran
        </Text>
        <View 
          className="bg-white rounded-[24px] p-4 mb-6 border border-[#F2F2F7]"
          style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 }}
        >
          {/* Tanggal Gajian */}
          <Pressable 
            onPress={() => openEdit('payday', settings.payday.toString())}
            className="flex-row items-center justify-between py-3.5 border-b border-[#F2F2F7]"
          >
            <View className="flex-row items-center flex-1 pr-3">
              <View className="w-9 h-9 rounded-xl bg-[#EFF6FF] items-center justify-center mr-3">
                <Feather name="calendar" size={17} color="#0284C7" />
              </View>
              <View className="flex-1">
                <Text className="text-[11px] font-['Nunito_600SemiBold'] text-[#8E8E93]">Tanggal Awal Siklus / Gajian</Text>
                <Text className="text-[14px] font-['Nunito_700Bold'] text-[#0F172A] mt-0.5">
                  Setiap tanggal {settings.payday}
                </Text>
              </View>
            </View>
            <View className="flex-row items-center">
              <Text className="text-[12px] font-['Nunito_700Bold'] text-[#0284C7] mr-1.5">Ubah</Text>
              <Feather name="chevron-right" size={18} color="#C7C7CC" />
            </View>
          </Pressable>

          {/* Mata Uang */}
          <View className="flex-row items-center justify-between py-3.5 border-b border-[#F2F2F7]">
            <View className="flex-row items-center flex-1 pr-3">
              <View className="w-9 h-9 rounded-xl bg-[#F5F3FF] items-center justify-center mr-3">
                <MaterialCommunityIcons name="currency-usd" size={19} color="#8B5CF6" />
              </View>
              <View className="flex-1">
                <Text className="text-[11px] font-['Nunito_600SemiBold'] text-[#8E8E93]">Mata Uang Utama</Text>
                <Text className="text-[14px] font-['Nunito_700Bold'] text-[#0F172A] mt-0.5">{settings.currency}</Text>
              </View>
            </View>
            <View className="bg-gray-100 px-2 py-0.5 rounded-md">
              <Text className="text-[10px] font-['Nunito_700Bold'] text-gray-500">Terkunci</Text>
            </View>
          </View>

          {/* Format Saldo */}
          <Pressable 
            onPress={() => openEdit('balanceFormat', settings.balanceFormat)}
            className="flex-row items-center justify-between py-3.5"
          >
            <View className="flex-row items-center flex-1 pr-3">
              <View className="w-9 h-9 rounded-xl bg-[#FFFBEB] items-center justify-center mr-3">
                <MaterialCommunityIcons name="format-list-numbered" size={19} color="#D97706" />
              </View>
              <View className="flex-1">
                <Text className="text-[11px] font-['Nunito_600SemiBold'] text-[#8E8E93]">Format Tampilan Saldo</Text>
                <Text className="text-[14px] font-['Nunito_700Bold'] text-[#0F172A] mt-0.5">{settings.balanceFormat}</Text>
              </View>
            </View>
            <Feather name="chevron-right" size={18} color="#C7C7CC" />
          </Pressable>
        </View>

        {/* Section 3: Cloud & Sinkronisasi */}
        <Text className="text-[13px] font-['Nunito_800ExtraBold'] text-[#8E8E93] mb-2.5 ml-2 uppercase tracking-wider">
          Penyimpanan & Cadangan Cloud
        </Text>
        <View 
          className="bg-white rounded-[24px] p-5 mb-6 border border-[#F2F2F7]"
          style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 }}
        >
          <View className="flex-row items-center justify-between pb-4 border-b border-[#F2F2F7]">
            <View className="flex-row items-center flex-1 pr-3">
              <View className="w-10 h-10 rounded-2xl bg-[#EFF6FF] items-center justify-center mr-3.5">
                <Feather name="cloud" size={19} color="#0284C7" />
              </View>
              <View className="flex-1">
                <Text className="text-[14px] font-['Nunito_700Bold'] text-[#0F172A]">Cadangan Otomatis</Text>
                <Text className="text-[11px] font-['Nunito_600SemiBold'] text-[#64748B] mt-0.5">
                  Sinkronkan transaksi ke akun Google Drive Anda
                </Text>
              </View>
            </View>
            <Switch
              value={settings.autoBackup}
              onValueChange={(val) => saveSettings({ ...settings, autoBackup: val })}
              trackColor={{ false: '#E2E8F0', true: '#BFDBFE' }}
              thumbColor={settings.autoBackup ? '#0284C7' : '#94A3B8'}
            />
          </View>

          <View className="flex-row items-center justify-between pt-4">
            <View>
              <Text className="text-[11px] font-['Nunito_600SemiBold'] text-[#8E8E93]">Terakhir Dicadangkan</Text>
              <Text className="text-[13px] font-['Nunito_700Bold'] text-[#0F172A] mt-0.5">{settings.lastBackupDate}</Text>
            </View>
            <Pressable 
              onPress={handleBackupNow}
              disabled={isBackingUp}
              className="px-4 py-2 bg-[#0284C7] rounded-xl flex-row items-center"
            >
              <Feather name="refresh-cw" size={14} color="white" />
              <Text className="text-white text-[12px] font-['Nunito_700Bold'] ml-1.5">
                {isBackingUp ? 'Menyimpan...' : 'Cadangkan'}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Section 4: Kelola Data & Zona Aksi */}
        <Text className="text-[13px] font-['Nunito_800ExtraBold'] text-[#8E8E93] mb-2.5 ml-2 uppercase tracking-wider">
          Kelola Data & Akun
        </Text>
        <View 
          className="bg-white rounded-[24px] p-4 mb-8 border border-[#F2F2F7]"
          style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 }}
        >
          {/* Ekspor Data */}
          <Pressable 
            onPress={handleExportData}
            className="flex-row items-center justify-between py-3.5 border-b border-[#F2F2F7]"
          >
            <View className="flex-row items-center flex-1 pr-3">
              <View className="w-9 h-9 rounded-xl bg-[#ECFDF5] items-center justify-center mr-3">
                <Feather name="download" size={17} color="#10B981" />
              </View>
              <View className="flex-1">
                <Text className="text-[14px] font-['Nunito_700Bold'] text-[#0F172A]">Ekspor Data Keuangan</Text>
                <Text className="text-[11px] font-['Nunito_600SemiBold'] text-[#64748B] mt-0.5">
                  Unduh ke format spreadsheet Excel atau PDF
                </Text>
              </View>
            </View>
            <Feather name="chevron-right" size={18} color="#C7C7CC" />
          </Pressable>

          {/* Reset Data Transaksi */}
          <Pressable 
            onPress={handleResetData}
            className="flex-row items-center justify-between py-3.5 border-b border-[#F2F2F7]"
          >
            <View className="flex-row items-center flex-1 pr-3">
              <View className="w-9 h-9 rounded-xl bg-[#FFFBEB] items-center justify-center mr-3">
                <Feather name="rotate-ccw" size={17} color="#D97706" />
              </View>
              <View className="flex-1">
                <Text className="text-[14px] font-['Nunito_700Bold'] text-[#D97706]">Reset Riwayat Transaksi</Text>
                <Text className="text-[11px] font-['Nunito_600SemiBold'] text-[#64748B] mt-0.5">
                  Kosongkan semua riwayat tanpa menghapus akun
                </Text>
              </View>
            </View>
            <Feather name="chevron-right" size={18} color="#C7C7CC" />
          </Pressable>

          {/* Hapus Akun Permanen */}
          <Pressable 
            onPress={handleDeleteAccount}
            className="flex-row items-center justify-between py-3.5"
          >
            <View className="flex-row items-center flex-1 pr-3">
              <View className="w-9 h-9 rounded-xl bg-[#FEF2F2] items-center justify-center mr-3">
                <Feather name="trash-2" size={17} color="#EF4444" />
              </View>
              <View className="flex-1">
                <Text className="text-[14px] font-['Nunito_700Bold'] text-[#EF4444]">Hapus Akun Permanen</Text>
                <Text className="text-[11px] font-['Nunito_600SemiBold'] text-[#991B1B]/70 mt-0.5">
                  Hapus identitas dan semua data dari sistem
                </Text>
              </View>
            </View>
            <Feather name="chevron-right" size={18} color="#EF4444" />
          </Pressable>
        </View>

      </ScrollView>

      {/* Edit Modal (Bottom Sheet Slider) */}
      <Modal
        visible={modalType !== null}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalType(null)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          className="flex-1 justify-end"
        >
          {/* Overlay backdrop */}
          <Pressable 
            style={StyleSheet.absoluteFill} 
            className="bg-black/50" 
            onPress={() => setModalType(null)} 
          />

          <View 
            className="bg-white rounded-t-[32px] p-6 pb-9"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 10,
            }}
          >
            {/* Drag Handle */}
            <View className="w-12 h-1.5 bg-[#E2EAF3] rounded-full self-center mb-5" />

            {/* Modal Title */}
            <Text className="text-[18px] font-['Nunito_800ExtraBold'] text-[#0F172A] mb-1">
              {modalType === 'name' && 'Ubah Nama Lengkap'}
              {modalType === 'username' && 'Ubah Username'}
              {modalType === 'email' && 'Ubah Email Terdaftar'}
              {modalType === 'phone' && 'Ubah Nomor Handphone'}
              {modalType === 'job' && 'Pilih Bidang Pekerjaan'}
              {modalType === 'payday' && 'Tentukan Tanggal Siklus / Gajian'}
              {modalType === 'balanceFormat' && 'Pilih Format Saldo'}
              {modalType === 'avatar' && 'Pilih Avatar Profil'}
            </Text>
            <Text className="text-[12px] font-['Nunito_600SemiBold'] text-[#64748B] mb-5">
              {modalType === 'payday'
                ? 'Siklus pengeluaran dan grafik analitik bulanan akan dihitung mulai dari tanggal ini.'
                : 'Sesuaikan informasi profil akun Anda di bawah ini.'}
            </Text>

            {/* Content for Simple Text Inputs */}
            {(modalType === 'name' || modalType === 'username' || modalType === 'email' || modalType === 'phone') && (
              <View className="mb-6">
                <TextInput
                  value={editValue}
                  onChangeText={setEditValue}
                  placeholder="Ketik di sini..."
                  keyboardType={modalType === 'phone' ? 'phone-pad' : modalType === 'email' ? 'email-address' : 'default'}
                  autoCapitalize={modalType === 'name' ? 'words' : 'none'}
                  className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl px-4 py-3.5 text-[15px] font-['Nunito_700Bold'] text-[#0F172A]"
                />
              </View>
            )}

            {/* Content for Payday (1-31 Quick Grid / Input) */}
            {modalType === 'payday' && (
              <View className="mb-6">
                <View className="flex-row items-center bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl px-4 py-3 mb-4">
                  <Text className="text-[14px] font-['Nunito_700Bold'] text-[#0F172A] mr-2">Tanggal:</Text>
                  <TextInput
                    value={editValue}
                    onChangeText={setEditValue}
                    keyboardType="number-pad"
                    maxLength={2}
                    placeholder="1 - 31"
                    className="flex-1 text-[16px] font-['Nunito_800ExtraBold'] text-[#0284C7]"
                  />
                  <Text className="text-[13px] font-['Nunito_600SemiBold'] text-[#64748B]">setiap bulan</Text>
                </View>

                {/* Quick Presets */}
                <Text className="text-[12px] font-['Nunito_700Bold'] text-[#8E8E93] mb-2">Preset Umum:</Text>
                <View className="flex-row flex-wrap gap-2">
                  {[1, 20, 25, 27, 28, 30].map((day) => (
                    <Pressable
                      key={day}
                      onPress={() => setEditValue(day.toString())}
                      className={`px-4 py-2 rounded-xl border ${
                        editValue === day.toString()
                          ? 'bg-[#0284C7] border-[#0284C7]'
                          : 'bg-[#F8FAFC] border-[#E2E8F0]'
                      }`}
                    >
                      <Text
                        className={`text-[13px] font-['Nunito_700Bold'] ${
                          editValue === day.toString() ? 'text-white' : 'text-[#0F172A]'
                        }`}
                      >
                        Tgl {day}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}

            {/* Content for Job Options */}
            {modalType === 'job' && (
              <ScrollView className="max-h-[260px] mb-6">
                {JOB_OPTIONS.map((item) => (
                  <Pressable
                    key={item}
                    onPress={() => setEditValue(item)}
                    className={`flex-row items-center justify-between p-3.5 rounded-2xl mb-2 border ${
                      editValue === item ? 'bg-[#EFF6FF] border-[#0284C7]' : 'bg-white border-[#F1F5F9]'
                    }`}
                  >
                    <Text
                      className={`text-[14px] ${
                        editValue === item
                          ? "font-['Nunito_800ExtraBold'] text-[#0284C7]"
                          : "font-['Nunito_700Bold'] text-[#0F172A]"
                      }`}
                    >
                      {item}
                    </Text>
                    {editValue === item && <Feather name="check" size={18} color="#0284C7" />}
                  </Pressable>
                ))}
              </ScrollView>
            )}

            {/* Content for Balance Format Options */}
            {modalType === 'balanceFormat' && (
              <View className="mb-6">
                {BALANCE_FORMAT_OPTIONS.map((item) => (
                  <Pressable
                    key={item}
                    onPress={() => setEditValue(item)}
                    className={`flex-row items-center justify-between p-3.5 rounded-2xl mb-2 border ${
                      editValue === item ? 'bg-[#EFF6FF] border-[#0284C7]' : 'bg-white border-[#F1F5F9]'
                    }`}
                  >
                    <Text
                      className={`text-[14px] ${
                        editValue === item
                          ? "font-['Nunito_800ExtraBold'] text-[#0284C7]"
                          : "font-['Nunito_700Bold'] text-[#0F172A]"
                      }`}
                    >
                      {item}
                    </Text>
                    {editValue === item && <Feather name="check" size={18} color="#0284C7" />}
                  </Pressable>
                ))}
              </View>
            )}

            {/* Content for Avatar Selection Presets */}
            {modalType === 'avatar' && (
              <View className="mb-6">
                <Text className="text-[12px] font-['Nunito_700Bold'] text-[#8E8E93] mb-3">Pilih Karakter Avatar:</Text>
                <View className="flex-row flex-wrap justify-between gap-y-3">
                  {[11, 12, 13, 14, 15, 16, 17, 18].map((num) => {
                    const uri = `https://i.pravatar.cc/150?img=${num}`;
                    const isSelected = editValue === uri;
                    return (
                      <Pressable
                        key={num}
                        onPress={() => setEditValue(uri)}
                        className={`w-14 h-14 rounded-full overflow-hidden border-2 p-0.5 ${
                          isSelected ? 'border-[#0284C7]' : 'border-transparent'
                        }`}
                      >
                        <Image source={{ uri }} className="w-full h-full rounded-full" />
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            )}

            {/* Modal Actions */}
            <View className="flex-row gap-3">
              <Pressable
                onPress={() => setModalType(null)}
                className="flex-1 py-3.5 rounded-2xl bg-[#F1F5F9] items-center justify-center"
              >
                <Text className="text-[14px] font-['Nunito_700Bold'] text-[#64748B]">Batal</Text>
              </Pressable>
              <Pressable
                onPress={handleSaveModal}
                className="flex-1 py-3.5 rounded-2xl bg-[#0284C7] items-center justify-center"
              >
                <Text className="text-[14px] font-['Nunito_800ExtraBold'] text-white">Simpan</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

    </View>
  );
}
