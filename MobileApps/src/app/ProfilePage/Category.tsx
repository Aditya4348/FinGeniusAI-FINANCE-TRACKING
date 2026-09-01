import { View, Text, ScrollView, Pressable, Switch, Platform, UIManager, Modal, TextInput, KeyboardAvoidingView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

// Data Dummy Defaults
const DEFAULT_EXPENSE_CATEGORIES = [
  { id: '1', name: 'Makanan & Minuman', icon: 'coffee', color: '#F59E0B', bg: '#FFFBEB', locked: true },
  { id: '2', name: 'Transportasi', icon: 'navigation', color: '#3B82F6', bg: '#EFF6FF', locked: true },
  { id: '3', name: 'Tagihan & Cicilan', icon: 'file-text', color: '#EF4444', bg: '#FEF2F2', locked: true },
  { id: '4', name: 'Belanja Bulanan', icon: 'shopping-cart', color: '#10B981', bg: '#F0FDF4', locked: false },
  { id: '5', name: 'Hiburan', icon: 'tv', color: '#8B5CF6', bg: '#F3E8FF', locked: false },
  { id: '6', name: 'Kopi & Nongkrong', icon: 'smile', color: '#A855F7', bg: '#FAF5FF', locked: false },
];

const DEFAULT_INCOME_CATEGORIES = [
  { id: '7', name: 'Gaji Pokok', icon: 'briefcase', color: '#10B981', bg: '#F0FDF4', locked: true },
  { id: '8', name: 'Investasi & Bunga', icon: 'trending-up', color: '#3B82F6', bg: '#EFF6FF', locked: true },
  { id: '9', name: 'Hadiah / Bonus', icon: 'gift', color: '#F59E0B', bg: '#FFFBEB', locked: false },
];

// Options for CRUD Modal
const ICON_OPTIONS = ['coffee', 'navigation', 'file-text', 'shopping-cart', 'tv', 'smile', 'briefcase', 'trending-up', 'gift', 'heart', 'home', 'monitor', 'smartphone', 'tool', 'zap', 'activity', 'book', 'camera', 'music', 'truck'];

const COLOR_OPTIONS = [
  { color: '#F59E0B', bg: '#FFFBEB' },
  { color: '#3B82F6', bg: '#EFF6FF' },
  { color: '#EF4444', bg: '#FEF2F2' },
  { color: '#10B981', bg: '#F0FDF4' },
  { color: '#8B5CF6', bg: '#F3E8FF' },
  { color: '#A855F7', bg: '#FAF5FF' },
  { color: '#EC4899', bg: '#FDF2F8' },
  { color: '#F97316', bg: '#FFF7ED' },
];

export default function CategoryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<'expense' | 'income'>('expense');
  const [aiAutoCreate, setAiAutoCreate] = useState(true);

  // State untuk Data Kategori
  const [expenseCategories, setExpenseCategories] = useState(DEFAULT_EXPENSE_CATEGORIES);
  const [incomeCategories, setIncomeCategories] = useState(DEFAULT_INCOME_CATEGORIES);

  // State untuk Modal CRUD
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState('');
  
  const [formName, setFormName] = useState('');
  const [formIcon, setFormIcon] = useState(ICON_OPTIONS[0]);
  const [formColor, setFormColor] = useState(COLOR_OPTIONS[0]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const storedExpense = await AsyncStorage.getItem('expense_categories');
      const storedIncome = await AsyncStorage.getItem('income_categories');
      
      if (storedExpense) setExpenseCategories(JSON.parse(storedExpense));
      if (storedIncome) setIncomeCategories(JSON.parse(storedIncome));
    } catch (e) {
      console.log('Failed to load categories', e);
    }
  };

  const saveCategories = async (expense: any, income: any) => {
    try {
      await AsyncStorage.setItem('expense_categories', JSON.stringify(expense));
      await AsyncStorage.setItem('income_categories', JSON.stringify(income));
      setExpenseCategories(expense);
      setIncomeCategories(income);
    } catch (e) {
      console.log('Failed to save categories', e);
    }
  };

  const displayData = activeTab === 'expense' ? expenseCategories : incomeCategories;

  const handleTabChange = (tab: 'expense' | 'income') => {
    setActiveTab(tab);
  };

  // FUNGSI CRUD
  const openCreateModal = () => {
    setEditMode(false);
    setEditingId('');
    setFormName('');
    setFormIcon(ICON_OPTIONS[0]);
    setFormColor(COLOR_OPTIONS[0]);
    setModalVisible(true);
  };
  
  const openEditModal = (cat: any) => {
    if (cat.locked) return; // Kategori bawaan tidak bisa diedit
    setEditMode(true);
    setEditingId(cat.id);
    setFormName(cat.name);
    setFormIcon(cat.icon);
    const matchedColor = COLOR_OPTIONS.find(c => c.color === cat.color) || COLOR_OPTIONS[0];
    setFormColor(matchedColor);
    setModalVisible(true);
  };
  
  const handleSaveCategory = () => {
    if (!formName.trim()) return;
    
    const newCategory = {
      id: editMode ? editingId : Date.now().toString(),
      name: formName,
      icon: formIcon,
      color: formColor.color,
      bg: formColor.bg,
      locked: false, // Kategori buatan user tidak dilock
    };
    
    let newExpense = [...expenseCategories];
    let newIncome = [...incomeCategories];
    
    if (editMode) {
      if (activeTab === 'expense') {
        const index = newExpense.findIndex(c => c.id === editingId);
        if (index > -1) newExpense[index] = newCategory;
      } else {
        const index = newIncome.findIndex(c => c.id === editingId);
        if (index > -1) newIncome[index] = newCategory;
      }
    } else {
      if (activeTab === 'expense') {
        newExpense.push(newCategory);
      } else {
        newIncome.push(newCategory);
      }
    }
    
    saveCategories(newExpense, newIncome);
    setModalVisible(false);
  };
  
  const handleDeleteCategory = () => {
    let newExpense = [...expenseCategories];
    let newIncome = [...incomeCategories];
    
    if (activeTab === 'expense') {
      newExpense = newExpense.filter(c => c.id !== editingId);
    } else {
      newIncome = newIncome.filter(c => c.id !== editingId);
    }
    
    saveCategories(newExpense, newIncome);
    setModalVisible(false);
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

      {/* TABS */}
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
                    <Feather name={cat.icon as any} size={24} color={cat.color} />
                  </View>
                  <Text className="text-[15px] font-['Nunito_700Bold'] text-[#0F172A]">{cat.name}</Text>
                </View>

                {cat.locked ? (
                  <View className="px-2">
                    <Feather name="lock" size={16} color="#CBD5E1" />
                  </View>
                ) : (
                  <Pressable onPress={() => openEditModal(cat)} className="px-2 py-2">
                    <Feather name="edit-2" size={18} color="#94A3B8" />
                  </Pressable>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* TOMBOL TAMBAH */}
        <View className="px-6 mt-6">
          <Pressable 
            onPress={openCreateModal}
            className="flex-row items-center justify-center py-4 bg-white border-2 border-dashed border-[#CBD5E1] rounded-[20px]"
          >
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
            <Pressable 
              onPress={() => router.push('/ProfilePage/MappingAI')}
              className="flex-row items-center justify-between p-4"
            >
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

      {/* MODAL CRUD CATEGORY */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1 justify-end bg-black/50"
        >
          <View className="bg-white rounded-t-[32px] p-6 pb-10 shadow-lg">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-[20px] font-['Nunito_800ExtraBold'] text-[#0F172A]">
                {editMode ? 'Edit Kategori' : 'Kategori Baru'}
              </Text>
              <Pressable onPress={() => setModalVisible(false)} className="w-8 h-8 rounded-full bg-[#F1F5F9] items-center justify-center">
                <Feather name="x" size={18} color="#64748B" />
              </Pressable>
            </View>

            {/* Input Nama */}
            <Text className="text-[14px] font-['Nunito_700Bold'] text-[#64748B] mb-2">Nama Kategori</Text>
            <TextInput
              value={formName}
              onChangeText={setFormName}
              placeholder="Cth: Belanja Sayur"
              className="bg-[#F8FAFC] rounded-2xl p-4 text-[16px] font-['Nunito_600SemiBold'] text-[#0F172A] mb-6"
              style={{ borderWidth: 1, borderColor: '#E2EAF3' }}
            />

            {/* Pilih Icon */}
            <Text className="text-[14px] font-['Nunito_700Bold'] text-[#64748B] mb-2">Pilih Ikon</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
              <View className="flex-row">
                {ICON_OPTIONS.map((iconName) => (
                  <Pressable 
                    key={iconName} 
                    onPress={() => setFormIcon(iconName)}
                    className="w-12 h-12 rounded-2xl items-center justify-center mr-3"
                    style={{ backgroundColor: formIcon === iconName ? formColor.bg : '#F8FAFC', borderWidth: formIcon === iconName ? 2 : 1, borderColor: formIcon === iconName ? formColor.color : '#E2EAF3' }}
                  >
                    <Feather name={iconName as any} size={20} color={formIcon === iconName ? formColor.color : '#94A3B8'} />
                  </Pressable>
                ))}
              </View>
            </ScrollView>

            {/* Pilih Warna */}
            <Text className="text-[14px] font-['Nunito_700Bold'] text-[#64748B] mb-2">Pilih Warna</Text>
            <View className="flex-row flex-wrap mb-8">
              {COLOR_OPTIONS.map((c, index) => (
                <Pressable
                  key={index}
                  onPress={() => setFormColor(c)}
                  className="w-10 h-10 rounded-full items-center justify-center mr-4 mb-3"
                  style={{ backgroundColor: c.bg, borderWidth: formColor.color === c.color ? 2 : 0, borderColor: c.color }}
                >
                  <View className="w-5 h-5 rounded-full" style={{ backgroundColor: c.color }} />
                </Pressable>
              ))}
            </View>

            {/* Tombol Simpan & Hapus */}
            <View className="flex-row items-center">
              {editMode && (
                <Pressable 
                  onPress={handleDeleteCategory}
                  className="w-14 h-14 rounded-2xl bg-[#FEF2F2] items-center justify-center mr-4"
                >
                  <Feather name="trash-2" size={24} color="#EF4444" />
                </Pressable>
              )}
              <Pressable 
                onPress={handleSaveCategory}
                className="flex-1 h-14 rounded-2xl items-center justify-center"
                style={{ backgroundColor: formName.trim() ? '#3B82F6' : '#94A3B8' }}
                disabled={!formName.trim()}
              >
                <Text className="text-[16px] font-['Nunito_800ExtraBold'] text-white">Simpan Kategori</Text>
              </Pressable>
            </View>

          </View>
        </KeyboardAvoidingView>
      </Modal>

    </View>
  );
}
