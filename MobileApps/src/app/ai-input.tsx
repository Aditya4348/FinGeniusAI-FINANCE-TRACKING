import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Platform,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { useRupiahInput } from '@/hooks/useRupiahInput';

// Kategori Default
const DEFAULT_EXPENSE_CATEGORIES = [
  { id: '1', name: 'Makanan & Minuman', icon: 'coffee', color: '#F59E0B', bg: '#FFFBEB' },
  { id: '2', name: 'Transportasi', icon: 'navigation', color: '#3B82F6', bg: '#EFF6FF' },
  { id: '3', name: 'Tagihan & Cicilan', icon: 'file-text', color: '#EF4444', bg: '#FEF2F2' },
  { id: '4', name: 'Belanja Bulanan', icon: 'shopping-cart', color: '#10B981', bg: '#F0FDF4' },
  { id: '5', name: 'Hiburan', icon: 'tv', color: '#8B5CF6', bg: '#F3E8FF' },
  { id: '6', name: 'Kopi & Nongkrong', icon: 'smile', color: '#A855F7', bg: '#FAF5FF' },
];

const DEFAULT_INCOME_CATEGORIES = [
  { id: '7', name: 'Gaji Pokok', icon: 'briefcase', color: '#10B981', bg: '#F0FDF4' },
  { id: '8', name: 'Investasi & Bunga', icon: 'trending-up', color: '#3B82F6', bg: '#EFF6FF' },
  { id: '9', name: 'Hadiah / Bonus', icon: 'gift', color: '#F59E0B', bg: '#FFFBEB' },
];

const DEFAULT_WALLETS = [
  { id: 'w1', name: 'Tunai', icon: 'dollar-sign' },
  { id: 'w2', name: 'BCA', icon: 'credit-card' },
  { id: 'w3', name: 'DANA', icon: 'smartphone' },
  { id: 'w4', name: 'Gopay', icon: 'smartphone' },
  { id: 'w5', name: 'Mandiri', icon: 'credit-card' },
];

export default function BottomSheetActionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Mode Tab: 'catat' | 'scan'
  const [activeTab, setActiveTab] = useState<'catat' | 'scan'>('catat');

  // Form State
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const amountInput = useRupiahInput('');
  const [note, setNote] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<any>(DEFAULT_EXPENSE_CATEGORIES[0]);
  const [selectedWallet, setSelectedWallet] = useState<any>(DEFAULT_WALLETS[0]);

  // Categories & Wallets from Storage
  const [expenseCategories, setExpenseCategories] = useState(DEFAULT_EXPENSE_CATEGORIES);
  const [incomeCategories, setIncomeCategories] = useState(DEFAULT_INCOME_CATEGORIES);
  const [wallets, setWallets] = useState(DEFAULT_WALLETS);

  // Scanner State
  const [isScanning, setIsScanning] = useState(false);

  // Bottom Sheet Gesture & Animation
  const translateY = useSharedValue(0);

  const closeModal = () => {
    router.back();
  };

  const panGesture = Gesture.Pan()
    .activeOffsetY([10, 1000])
    .failOffsetX([-15, 15])
    .onChange((event) => {
      if (event.translationY > 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      if (event.translationY > 120 || event.velocityY > 400) {
        translateY.value = withSpring(800, { velocity: event.velocityY });
        runOnJS(closeModal)();
      } else {
        translateY.value = withSpring(0);
      }
    });

  const rBottomSheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  // Laser animation for camera viewfinder
  const laserY = useSharedValue(0);

  useEffect(() => {
    laserY.value = withRepeat(
      withSequence(
        withTiming(170, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const laserAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: laserY.value }],
  }));

  // Load custom categories & wallets
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const storedExp = await AsyncStorage.getItem('expense_categories');
      if (storedExp) setExpenseCategories(JSON.parse(storedExp));

      const storedInc = await AsyncStorage.getItem('income_categories');
      if (storedInc) setIncomeCategories(JSON.parse(storedInc));

      const storedWallets = await AsyncStorage.getItem('user_wallets');
      if (storedWallets) {
        const parsed = JSON.parse(storedWallets);
        if (parsed.length > 0) {
          setWallets(parsed);
          setSelectedWallet(parsed[0]);
        }
      }
    } catch (e) {
      console.log('Error loading initial data', e);
    }
  };

  // Tanggal Hari Ini Otomatis
  const getTodayFormatted = () => {
    const now = new Date();
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    return `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
  };

  // Switch type and reset category
  const handleTypeChange = (newType: 'expense' | 'income') => {
    setType(newType);
    if (newType === 'expense') {
      setSelectedCategory(expenseCategories[0] || DEFAULT_EXPENSE_CATEGORIES[0]);
    } else {
      setSelectedCategory(incomeCategories[0] || DEFAULT_INCOME_CATEGORIES[0]);
    }
  };

  // Quick Amount chips
  const addQuickAmount = (nominal: number) => {
    const current = parseInt(amountInput.rawValue || '0', 10);
    const updated = current + nominal;
    amountInput.onChangeText(updated.toString());
  };

  // Simpan Transaksi Manual
  const handleSaveTransaction = async () => {
    if (!amountInput.rawValue || parseInt(amountInput.rawValue, 10) <= 0) {
      Alert.alert('Perhatian', 'Silakan masukkan jumlah transaksi.');
      return;
    }

    try {
      const numericAmount = parseInt(amountInput.rawValue, 10);
      const newTx = {
        id: Date.now().toString(),
        title: note.trim() || selectedCategory.name,
        category: selectedCategory.name,
        amount: (type === 'expense' ? '-Rp ' : '+Rp ') + numericAmount.toLocaleString('id-ID'),
        type,
        date: `Hari Ini, ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`,
        wallet: selectedWallet.name,
        icon: selectedCategory.icon,
        color: selectedCategory.color,
        bg: selectedCategory.bg,
      };

      // Simpan ke riwayat transaksi
      const storedTx = await AsyncStorage.getItem('user_transactions');
      const txList = storedTx ? JSON.parse(storedTx) : [];
      await AsyncStorage.setItem('user_transactions', JSON.stringify([newTx, ...txList]));

      Alert.alert('Berhasil! 🎉', `${selectedCategory.name} sebesar Rp ${numericAmount.toLocaleString('id-ID')} berhasil dicatat.`);
      router.back();
    } catch (e) {
      Alert.alert('Error', 'Gagal menyimpan transaksi.');
    }
  };

  // Simulasi Scan Nota AI
  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      amountInput.onChangeText('48500');
      setNote('Indomaret - Belanja Harian');
      setType('expense');
      const foundCat = expenseCategories.find((c) => c.name.includes('Belanja')) || expenseCategories[0];
      setSelectedCategory(foundCat);
      setActiveTab('catat');

      Alert.alert('Nota Terdeteksi! 🧾✨', 'AI berhasil membaca nota belanja:\n• Total: Rp 48.500\n• Tempat: Indomaret\n\nSilakan periksa dan simpan.');
    }, 1800);
  };

  const activeCategories = type === 'expense' ? expenseCategories : incomeCategories;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Backdrop Blur Effect - Tekan untuk menutup */}
        <Pressable style={StyleSheet.absoluteFill} onPress={closeModal}>
          <BlurView intensity={35} tint="dark" style={StyleSheet.absoluteFill} />
        </Pressable>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardContainer}
        >
          <View style={styles.bottomSheetWrapper}>
            
            {/* BOTTOM SLIDER SHEET CONTAINER */}
            <Animated.View
              style={[
                styles.sheetContainer,
                { paddingBottom: Math.max(insets.bottom + 16, 28) },
                rBottomSheetStyle,
              ]}
            >
              {/* 1. Drag Handle & Header Area (Geser area ini ke bawah untuk menutup) */}
              <GestureDetector gesture={panGesture}>
                <View style={styles.dragArea}>
                  <View style={styles.dragHandle} />

                  {/* Header & Tombol X */}
                  <View style={styles.sheetHeader}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <View style={styles.headerIconCircle}>
                        <MaterialCommunityIcons name="wallet-plus-outline" size={20} color="#0284C7" />
                      </View>
                      <Text style={styles.headerTitle}>Tambah Transaksi</Text>
                    </View>

                    <Pressable onPress={closeModal} style={styles.closeIconButton}>
                      <Feather name="x" size={20} color="#64748B" />
                    </Pressable>
                  </View>
                </View>
              </GestureDetector>

                {/* 3. TABS: SCAN NOTA & CATAT */}
                <View style={styles.tabsNavWrapper}>
                  <Pressable
                    onPress={() => setActiveTab('catat')}
                    style={[
                      styles.tabNavItem,
                      activeTab === 'catat' && styles.tabNavItemActive,
                    ]}
                  >
                    <Feather
                      name="edit-3"
                      size={15}
                      color={activeTab === 'catat' ? '#0284C7' : '#64748B'}
                    />
                    <Text
                      style={[
                        styles.tabNavText,
                        activeTab === 'catat' && styles.tabNavTextActive,
                      ]}
                    >
                      Catat Manual
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => setActiveTab('scan')}
                    style={[
                      styles.tabNavItem,
                      activeTab === 'scan' && styles.tabNavItemActive,
                    ]}
                  >
                    <Feather
                      name="maximize"
                      size={15}
                      color={activeTab === 'scan' ? '#0284C7' : '#64748B'}
                    />
                    <Text
                      style={[
                        styles.tabNavText,
                        activeTab === 'scan' && styles.tabNavTextActive,
                      ]}
                    >
                      Scan Nota (AI)
                    </Text>
                  </Pressable>
                </View>

                {/* 4. KONTEN BOTTOM SLIDER */}
                {activeTab === 'catat' ? (
                  /* ================= TAB CATAT MANUAL ================= */
                  <ScrollView
                    style={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                  >
                    {/* A. Toggle Pemasukan / Pengeluaran */}
                    <View style={styles.typeToggleWrapper}>
                      <Pressable
                        onPress={() => handleTypeChange('expense')}
                        style={[
                          styles.typeBtn,
                          type === 'expense' && styles.typeBtnExpenseActive,
                        ]}
                      >
                        <Feather
                          name="arrow-up-right"
                          size={16}
                          color={type === 'expense' ? '#EF4444' : '#64748B'}
                        />
                        <Text
                          style={[
                            styles.typeBtnText,
                            type === 'expense' && { color: '#EF4444' },
                          ]}
                        >
                          Pengeluaran
                        </Text>
                      </Pressable>

                      <Pressable
                        onPress={() => handleTypeChange('income')}
                        style={[
                          styles.typeBtn,
                          type === 'income' && styles.typeBtnIncomeActive,
                        ]}
                      >
                        <Feather
                          name="arrow-down-left"
                          size={16}
                          color={type === 'income' ? '#10B981' : '#64748B'}
                        />
                        <Text
                          style={[
                            styles.typeBtnText,
                            type === 'income' && { color: '#10B981' },
                          ]}
                        >
                          Pemasukan
                        </Text>
                      </Pressable>
                    </View>

                    {/* B. Input Jumlah Transaksi */}
                    <Text style={styles.fieldLabel}>Jumlah</Text>
                    <View style={styles.amountInputBox}>
                      <TextInput
                        value={amountInput.value}
                        onChangeText={amountInput.onChangeText}
                        keyboardType="numeric"
                        placeholder="Rp 0"
                        placeholderTextColor="#94A3B8"
                        style={[
                          styles.amountInputText,
                          { color: type === 'expense' ? '#EF4444' : '#10B981' },
                        ]}
                      />
                      {amountInput.value ? (
                        <Pressable onPress={amountInput.reset} style={{ padding: 4 }}>
                          <Feather name="x-circle" size={18} color="#94A3B8" />
                        </Pressable>
                      ) : null}
                    </View>

                    {/* Quick Amount Chips */}
                    <View style={styles.quickChipsRow}>
                      {[10000, 20000, 50000, 100000].map((nominal) => (
                        <Pressable
                          key={nominal}
                          onPress={() => addQuickAmount(nominal)}
                          style={styles.chipButton}
                        >
                          <Text style={styles.chipText}>+{nominal / 1000}rb</Text>
                        </Pressable>
                      ))}
                    </View>

                    {/* C. Pilih Kategori */}
                    <Text style={styles.fieldLabel}>Kategori</Text>
                    <ScrollView 
                      horizontal 
                      showsHorizontalScrollIndicator={false} 
                      nestedScrollEnabled={true}
                      keyboardShouldPersistTaps="always"
                      style={{ marginBottom: 14 }}
                    >
                      <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 2 }}>
                        {activeCategories.map((cat) => {
                          const isSelected = selectedCategory?.id === cat.id;
                          return (
                            <Pressable
                              key={cat.id}
                              onPress={() => setSelectedCategory(cat)}
                              style={[
                                styles.categoryChip,
                                {
                                  backgroundColor: isSelected ? cat.bg : '#F8FAFC',
                                  borderColor: isSelected ? cat.color : '#E2EAF3',
                                  borderWidth: isSelected ? 2 : 1,
                                },
                              ]}
                            >
                              <Feather name={cat.icon as any} size={15} color={isSelected ? cat.color : '#64748B'} />
                              <Text
                                style={[
                                  styles.categoryChipText,
                                  { color: isSelected ? cat.color : '#475569' },
                                ]}
                              >
                                {cat.name}
                              </Text>
                            </Pressable>
                          );
                        })}
                      </View>
                    </ScrollView>

                    {/* D. Sumber Dana (Dompet) */}
                    <Text style={styles.fieldLabel}>Sumber Dana (Dompet)</Text>
                    <ScrollView 
                      horizontal 
                      showsHorizontalScrollIndicator={false} 
                      nestedScrollEnabled={true}
                      keyboardShouldPersistTaps="always"
                      style={{ marginBottom: 14 }}
                    >
                      <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 2 }}>
                        {wallets.map((w) => {
                          const isSelected = selectedWallet?.id === w.id;
                          return (
                            <Pressable
                              key={w.id}
                              onPress={() => setSelectedWallet(w)}
                              style={[
                                styles.walletChip,
                                isSelected && styles.walletChipSelected,
                              ]}
                            >
                              <Feather
                                name={(w.icon as any) || 'credit-card'}
                                size={14}
                                color={isSelected ? '#0284C7' : '#64748B'}
                              />
                              <Text
                                style={[
                                  styles.walletChipText,
                                  isSelected && { color: '#0284C7' },
                                ]}
                              >
                                {w.name}
                              </Text>
                            </Pressable>
                          );
                        })}
                      </View>
                    </ScrollView>

                    {/* E. Catatan Opsional */}
                    <Text style={styles.fieldLabel}>Catatan (Opsional)</Text>
                    <View style={styles.noteInputBox}>
                      <TextInput
                        value={note}
                        onChangeText={setNote}
                        placeholder="Contoh: Makan siang, bayar tagihan wifi..."
                        placeholderTextColor="#94A3B8"
                        style={styles.noteInputText}
                      />
                    </View>

                    {/* F. Tanggal Otomatis Hari Ini */}
                    <View style={styles.dateBadgeBox}>
                      <Feather name="calendar" size={15} color="#0284C7" />
                      <Text style={styles.dateBadgeText}>Tanggal: {getTodayFormatted()}</Text>
                      <View style={styles.autoTag}>
                        <Text style={styles.autoTagText}>Hari ini</Text>
                      </View>
                    </View>

                    {/* G. Tombol Simpan Transaksi */}
                    <Pressable
                      onPress={handleSaveTransaction}
                      style={[
                        styles.saveButton,
                        {
                          backgroundColor: amountInput.rawValue ? '#0284C7' : '#94A3B8',
                        },
                      ]}
                      disabled={!amountInput.rawValue}
                    >
                      <Feather name="check" size={18} color="#FFFFFF" />
                      <Text style={styles.saveButtonText}>Simpan Transaksi</Text>
                    </Pressable>

                    <View style={{ height: 20 }} />
                  </ScrollView>
                ) : (
                  /* ================= TAB SCAN NOTA (AI) ================= */
                  <View style={styles.scannerWrapper}>
                    <View style={styles.cameraBox}>
                      
                      {/* Top Bar Camera View */}
                      <View style={styles.cameraTopBar}>
                        <View style={styles.smartBadge}>
                          <MaterialCommunityIcons name="lightning-bolt" size={15} color="#38BDF8" />
                          <Text style={styles.smartBadgeText}>AI SCAN NOTA</Text>
                        </View>

                        <Pressable onPress={handleSimulateScan} style={styles.galleryButton}>
                          <Feather name="image" size={16} color="#FFFFFF" />
                        </Pressable>
                      </View>

                      {/* Viewfinder Target */}
                      <View style={styles.viewfinder}>
                        <View style={[styles.corner, styles.cornerTL]} />
                        <View style={[styles.corner, styles.cornerTR]} />
                        <View style={[styles.corner, styles.cornerBL]} />
                        <View style={[styles.corner, styles.cornerBR]} />

                        {/* Animated Laser Line */}
                        <Animated.View style={[styles.laserLine, laserAnimatedStyle]} />

                        {isScanning ? (
                          <View style={styles.scanLoadingOverlay}>
                            <ActivityIndicator size="large" color="#38BDF8" />
                            <Text style={styles.scanLoadingText}>Membaca total & rincian struk...</Text>
                          </View>
                        ) : (
                          <View style={styles.viewfinderCenter}>
                            <MaterialCommunityIcons name="text-recognition" size={36} color="rgba(255,255,255,0.7)" />
                            <Text style={styles.viewfinderHint}>Posisikan nota / struk belanja di dalam kotak</Text>
                          </View>
                        )}
                      </View>

                      {/* Shutter Action Button */}
                      <View style={styles.cameraBottomBar}>
                        <Pressable
                          onPress={handleSimulateScan}
                          disabled={isScanning}
                          style={styles.shutterButton}
                        >
                          <View style={styles.shutterInner}>
                            <Feather name="camera" size={22} color="#0284C7" />
                          </View>
                        </Pressable>
                        <Text style={styles.cameraBottomHint}>Sentuh untuk foto struk</Text>
                      </View>

                    </View>
                  </View>
                )}

              </Animated.View>

          </View>
        </KeyboardAvoidingView>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  keyboardContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bottomSheetWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 12,
  },
  dragArea: {
    width: '100%',
    paddingTop: 8,
    backgroundColor: 'transparent',
  },
  dragHandle: {
    width: 44,
    height: 5,
    backgroundColor: '#CBD5E1',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 6,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Nunito_800ExtraBold',
    color: '#0F172A',
  },
  closeIconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
  },

  /* TABS NAVIGATOR (SCAN NOTA / CATAT MANUAL) */
  tabsNavWrapper: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    marginHorizontal: 20,
    marginTop: 4,
    marginBottom: 12,
    borderRadius: 14,
    padding: 3,
    gap: 4,
  },
  tabNavItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 11,
    gap: 6,
  },
  tabNavItemActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  tabNavText: {
    fontSize: 13,
    fontFamily: 'Nunito_700Bold',
    color: '#64748B',
  },
  tabNavTextActive: {
    color: '#0284C7',
  },

  /* SCROLL CONTENT */
  scrollContent: {
    paddingHorizontal: 20,
  },

  /* TOGGLE PEMASUKAN / PENGELUARAN */
  typeToggleWrapper: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2EAF3',
    borderRadius: 14,
    padding: 3,
    marginBottom: 14,
    gap: 4,
  },
  typeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 11,
    gap: 6,
  },
  typeBtnExpenseActive: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  typeBtnIncomeActive: {
    backgroundColor: '#ECFDF3',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  typeBtnText: {
    fontSize: 13,
    fontFamily: 'Nunito_700Bold',
    color: '#64748B',
  },

  /* FORM FIELDS */
  fieldLabel: {
    fontSize: 12,
    fontFamily: 'Nunito_700Bold',
    color: '#475569',
    marginBottom: 6,
    marginLeft: 2,
  },
  amountInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2EAF3',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 54,
    marginBottom: 8,
  },
  amountInputText: {
    flex: 1,
    fontSize: 22,
    fontFamily: 'Nunito_800ExtraBold',
  },
  quickChipsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 14,
  },
  chipButton: {
    flex: 1,
    paddingVertical: 6,
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  chipText: {
    color: '#0284C7',
    fontSize: 11,
    fontFamily: 'Nunito_700Bold',
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    gap: 6,
  },
  categoryChipText: {
    fontSize: 12,
    fontFamily: 'Nunito_700Bold',
  },
  walletChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2EAF3',
    backgroundColor: '#F8FAFC',
    gap: 6,
  },
  walletChipSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: '#0284C7',
    borderWidth: 1.5,
  },
  walletChipText: {
    fontSize: 12,
    fontFamily: 'Nunito_700Bold',
    color: '#64748B',
  },
  noteInputBox: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2EAF3',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    justifyContent: 'center',
    marginBottom: 14,
  },
  noteInputText: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    color: '#0F172A',
  },
  dateBadgeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2EAF3',
    marginBottom: 18,
    gap: 8,
  },
  dateBadgeText: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'Nunito_700Bold',
    color: '#334155',
  },
  autoTag: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  autoTagText: {
    color: '#0284C7',
    fontSize: 10,
    fontFamily: 'Nunito_800ExtraBold',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 16,
    gap: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'Nunito_800ExtraBold',
  },

  /* SCANNER STYLES */
  scannerWrapper: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  cameraBox: {
    height: 320,
    backgroundColor: '#0F172A',
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'space-between',
    padding: 14,
  },
  cameraTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  smartBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    gap: 6,
  },
  smartBadgeText: {
    color: '#38BDF8',
    fontSize: 11,
    fontFamily: 'Nunito_800ExtraBold',
  },
  galleryButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewfinder: {
    alignSelf: 'center',
    width: 210,
    height: 180,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  corner: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderColor: '#38BDF8',
  },
  cornerTL: { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3 },
  cornerTR: { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3 },
  cornerBL: { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3 },
  cornerBR: { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3 },
  laserLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 3,
    backgroundColor: '#38BDF8',
    shadowColor: '#38BDF8',
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  scanLoadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  scanLoadingText: {
    color: '#38BDF8',
    fontSize: 12,
    fontFamily: 'Nunito_700Bold',
  },
  viewfinderCenter: {
    alignItems: 'center',
    gap: 6,
  },
  viewfinderHint: {
    color: '#CBD5E1',
    fontSize: 11,
    fontFamily: 'Nunito_600SemiBold',
    textAlign: 'center',
    paddingHorizontal: 12,
  },
  cameraBottomBar: {
    alignItems: 'center',
    paddingBottom: 2,
    gap: 4,
  },
  shutterButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutterInner: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraBottomHint: {
    color: '#94A3B8',
    fontSize: 10,
    fontFamily: 'Nunito_600SemiBold',
  },
});
