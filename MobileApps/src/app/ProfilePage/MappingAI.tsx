import { View, Text, ScrollView, Pressable, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MappingAIScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // State
  const [mappings, setMappings] = useState<any[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<any[]>([]);
  const [incomeCategories, setIncomeCategories] = useState<any[]>([]);

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [formKeyword, setFormKeyword] = useState('');
  const [formCategoryId, setFormCategoryId] = useState('');
  const [formCategoryType, setFormCategoryType] = useState<'expense'|'income'>('expense');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const storedMappings = await AsyncStorage.getItem('mapping_rules');
      if (storedMappings) setMappings(JSON.parse(storedMappings));
      
      const storedExpense = await AsyncStorage.getItem('expense_categories');
      if (storedExpense) setExpenseCategories(JSON.parse(storedExpense));
      
      const storedIncome = await AsyncStorage.getItem('income_categories');
      if (storedIncome) setIncomeCategories(JSON.parse(storedIncome));
    } catch (e) {
      console.log('Failed to load data', e);
    }
  };

  const saveMappings = async (newMappings: any[]) => {
    try {
      await AsyncStorage.setItem('mapping_rules', JSON.stringify(newMappings));
      setMappings(newMappings);
    } catch (e) {
      console.log('Failed to save mappings', e);
    }
  };

  const handleDelete = (id: string) => {
    const newMappings = mappings.filter(m => m.id !== id);
    saveMappings(newMappings);
  };

  const handleSave = () => {
    if (!formKeyword.trim() || !formCategoryId) return;
    
    const newRule = {
      id: Date.now().toString(),
      keyword: formKeyword.trim(),
      categoryId: formCategoryId,
      type: formCategoryType
    };
    
    saveMappings([...mappings, newRule]);
    setModalVisible(false);
  };

  const openModal = () => {
    setFormKeyword('');
    setFormCategoryId('');
    setFormCategoryType('expense');
    setModalVisible(true);
  };

  const getCategoryDetails = (id: string, type: string) => {
    const list = type === 'expense' ? expenseCategories : incomeCategories;
    return list.find(c => c.id === id);
  };

  const activeCategories = formCategoryType === 'expense' ? expenseCategories : incomeCategories;

  return (
    <View className="flex-1 bg-[#EEF3F9]" style={{ paddingTop: insets.top }}>
      
      {/* HEADER */}
      <View className="flex-row items-center px-6 pt-4 pb-2">
        <Pressable 
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-white items-center justify-center border border-[#E2EAF3] mr-4"
        >
          <Feather name="arrow-left" size={20} color="#0F172A" />
        </Pressable>
        <Text className="text-[22px] font-['Nunito_800ExtraBold'] text-[#0F172A] tracking-tight">Kamus Mapping AI</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* EXPLAINER */}
        <View className="px-6 mt-4">
          <View className="bg-gradient-to-r from-[#EFF6FF] to-[#F5F3FF] p-4 rounded-[20px] border border-[#E2EAF3]">
            <View className="flex-row items-center mb-2">
              <MaterialCommunityIcons name="brain" size={20} color="#3B82F6" />
              <Text className="text-[15px] font-['Nunito_800ExtraBold'] text-[#0F172A] ml-2">Cara Kerja Kamus AI</Text>
            </View>
            <Text className="text-[13px] font-['Nunito_600SemiBold'] text-[#64748B] leading-5">
              Ajari AI agar lebih pintar! Jika Anda mengatur "Gojek" ke kategori "Transportasi", AI akan otomatis mencatatnya tanpa bertanya lagi di masa depan.
            </Text>
          </View>
        </View>

        {/* LIST RULES */}
        <View className="px-6 mt-6">
          <Text className="text-[14px] font-['Nunito_800ExtraBold'] text-[#94A3B8] mb-3 ml-2 uppercase tracking-wider">
            Daftar Aturan ({mappings.length})
          </Text>

          {mappings.length === 0 ? (
            <View className="items-center justify-center py-10 bg-white rounded-[24px] border border-dashed border-[#CBD5E1]">
              <Feather name="book-open" size={40} color="#CBD5E1" />
              <Text className="text-[14px] font-['Nunito_600SemiBold'] text-[#94A3B8] mt-4 text-center">Belum ada aturan mapping.{'\n'}Buat aturan pertama Anda!</Text>
            </View>
          ) : (
            <View className="bg-white rounded-[24px] p-2" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 }}>
              {mappings.map((item, index) => {
                const cat = getCategoryDetails(item.categoryId, item.type);
                if (!cat) return null;
                
                return (
                  <View 
                    key={item.id} 
                    className="flex-row items-center justify-between p-3"
                    style={{ borderBottomWidth: index !== mappings.length - 1 ? 1 : 0, borderBottomColor: '#F1F5F9' }}
                  >
                    <View className="flex-row items-center flex-1">
                      <View className="bg-[#F8FAFC] px-3 py-2 rounded-xl border border-[#E2EAF3] mr-2 flex-1">
                        <Text className="text-[14px] font-['Nunito_700Bold'] text-[#0F172A]" numberOfLines={1}>"{item.keyword}"</Text>
                      </View>
                      <Feather name="arrow-right" size={16} color="#94A3B8" className="mx-1" />
                      <View className="flex-row items-center px-3 py-2 rounded-xl flex-1 ml-2" style={{ backgroundColor: cat.bg }}>
                        <Feather name={cat.icon as any} size={14} color={cat.color} />
                        <Text className="text-[13px] font-['Nunito_700Bold'] ml-2" style={{ color: cat.color }} numberOfLines={1}>{cat.name}</Text>
                      </View>
                    </View>
                    <Pressable onPress={() => handleDelete(item.id)} className="p-2 ml-2">
                      <Feather name="trash-2" size={18} color="#EF4444" />
                    </Pressable>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {/* TOMBOL TAMBAH */}
        <View className="px-6 mt-6">
          <Pressable 
            onPress={openModal}
            className="flex-row items-center justify-center py-4 bg-[#3B82F6] rounded-[20px]"
            style={{ shadowColor: '#3B82F6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 }}
          >
            <Feather name="plus" size={20} color="#FFFFFF" />
            <Text className="text-[15px] font-['Nunito_800ExtraBold'] text-[#FFFFFF] ml-2">Tambah Aturan Mapping</Text>
          </Pressable>
        </View>

      </ScrollView>

      {/* MODAL TAMBAH RULE */}
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
              <Text className="text-[20px] font-['Nunito_800ExtraBold'] text-[#0F172A]">Aturan Baru</Text>
              <Pressable onPress={() => setModalVisible(false)} className="w-8 h-8 rounded-full bg-[#F1F5F9] items-center justify-center">
                <Feather name="x" size={18} color="#64748B" />
              </Pressable>
            </View>

            {/* Input Kata Kunci */}
            <Text className="text-[14px] font-['Nunito_700Bold'] text-[#64748B] mb-2">Jika AI mendeteksi kata:</Text>
            <TextInput
              value={formKeyword}
              onChangeText={setFormKeyword}
              placeholder="Cth: Gojek, PLN, Alfamart"
              className="bg-[#F8FAFC] rounded-2xl p-4 text-[16px] font-['Nunito_600SemiBold'] text-[#0F172A] mb-6"
              style={{ borderWidth: 1, borderColor: '#E2EAF3' }}
            />

            {/* Tabs Pemasukan/Pengeluaran untuk modal */}
            <Text className="text-[14px] font-['Nunito_700Bold'] text-[#64748B] mb-2">Maka masukkan ke kategori:</Text>
            <View className="flex-row bg-[#F1F5F9] rounded-xl p-1 mb-4">
              <Pressable 
                onPress={() => { setFormCategoryType('expense'); setFormCategoryId(''); }}
                className="flex-1 py-2 rounded-lg items-center justify-center"
                style={formCategoryType === 'expense' ? { backgroundColor: 'white', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 } : { backgroundColor: 'transparent' }}
              >
                <Text className={`text-[13px] font-['Nunito_700Bold'] ${formCategoryType === 'expense' ? 'text-[#0F172A]' : 'text-[#64748B]'}`}>Pengeluaran</Text>
              </Pressable>
              <Pressable 
                onPress={() => { setFormCategoryType('income'); setFormCategoryId(''); }}
                className="flex-1 py-2 rounded-lg items-center justify-center"
                style={formCategoryType === 'income' ? { backgroundColor: 'white', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 } : { backgroundColor: 'transparent' }}
              >
                <Text className={`text-[13px] font-['Nunito_700Bold'] ${formCategoryType === 'income' ? 'text-[#0F172A]' : 'text-[#64748B]'}`}>Pemasukan</Text>
              </Pressable>
            </View>

            {/* Scroll Kategori */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-8" style={{ maxHeight: 60 }}>
              <View className="flex-row items-center px-1">
                {activeCategories.map((cat) => (
                  <Pressable
                    key={cat.id}
                    onPress={() => setFormCategoryId(cat.id)}
                    className="flex-row items-center px-4 py-2.5 rounded-xl mr-3"
                    style={{ 
                      backgroundColor: formCategoryId === cat.id ? cat.bg : '#F8FAFC',
                      borderWidth: 2,
                      borderColor: formCategoryId === cat.id ? cat.color : 'transparent'
                    }}
                  >
                    <Feather name={cat.icon as any} size={16} color={formCategoryId === cat.id ? cat.color : '#94A3B8'} />
                    <Text 
                      className="text-[14px] font-['Nunito_700Bold'] ml-2"
                      style={{ color: formCategoryId === cat.id ? cat.color : '#64748B' }}
                    >
                      {cat.name}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>

            {/* Tombol Simpan */}
            <Pressable 
              onPress={handleSave}
              className="h-14 rounded-2xl items-center justify-center w-full"
              style={{ backgroundColor: formKeyword.trim() && formCategoryId ? '#3B82F6' : '#E2EAF3' }}
              disabled={!formKeyword.trim() || !formCategoryId}
            >
              <Text className={`text-[16px] font-['Nunito_800ExtraBold'] ${formKeyword.trim() && formCategoryId ? 'text-white' : 'text-[#94A3B8]'}`}>
                Simpan Aturan
              </Text>
            </Pressable>

          </View>
        </KeyboardAvoidingView>
      </Modal>

    </View>
  );
}
