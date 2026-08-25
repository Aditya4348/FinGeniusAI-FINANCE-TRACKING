import { View, Text, Pressable, TextInput, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useRupiahInput } from '@/hooks/useRupiahInput';
import { LinearGradient } from 'expo-linear-gradient';

export default function LimitDayWizardScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  const [step, setStep] = useState(1);
  const [isCalculating, setIsCalculating] = useState(false);

  // --- FORM STATES ---
  const incomeInput = useRupiahInput('');
  
  const [fixedExpenses, setFixedExpenses] = useState([{ id: '1', name: 'Kos / Kontrakan', amount: '' }]);
  const handleExpenseChange = (id: string, text: string) => {
    const numericOnly = text.replace(/[^0-9]/g, '');
    const formatted = numericOnly ? `Rp ${parseInt(numericOnly, 10).toLocaleString('id-ID')}` : '';
    setFixedExpenses(prev => prev.map(exp => exp.id === id ? { ...exp, amount: formatted } : exp));
  };
  const addExpense = () => setFixedExpenses(prev => [...prev, { id: Date.now().toString(), name: '', amount: '' }]);
  const removeExpense = (id: string) => setFixedExpenses(prev => prev.filter(exp => exp.id !== id));
  
  const totalFixedExpense = fixedExpenses.reduce((acc, curr) => {
    return acc + parseInt(curr.amount.replace(/[^0-9]/g, '') || '0', 10);
  }, 0);

  const [mealsPerDay, setMealsPerDay] = useState(3);
  const costPerMealInput = useRupiahInput('20000');
  
  const [isSmoker, setIsSmoker] = useState<boolean | null>(null);
  const cigarettePriceInput = useRupiahInput('25000');
  const [cigaretteDays, setCigaretteDays] = useState('2');
  
  const [transport, setTransport] = useState('');

  const savingInput = useRupiahInput('');

  const [result, setResult] = useState<any>(null);

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else if (step === 4) {
      setIsCalculating(true);
      
      setTimeout(() => {
        const income = parseInt(incomeInput.rawValue || '0', 10);
        const saving = parseInt(savingInput.rawValue || '0', 10);
        const costPerMeal = parseInt(costPerMealInput.rawValue || '0', 10);
        const cigPrice = parseInt(cigarettePriceInput.rawValue || '0', 10);
        
        const availableMoney = income - totalFixedExpense - saving;
        let dailyLimit = availableMoney / 30;
        
        const dailyFood = mealsPerDay * costPerMeal;
        const dailyCig = isSmoker ? (cigPrice / parseInt(cigaretteDays || '1', 10)) : 0;
        const dailyTransport = transport === 'Motor' ? 15000 : transport === 'Umum' ? 20000 : transport === 'Mobil' ? 50000 : 30000;
        
        const requiredDaily = dailyFood + dailyCig + dailyTransport;
        let aiMessage = '';
        
        if (dailyLimit < requiredDaily) {
          aiMessage = `Peringatan! Uang harian Anda (Rp ${Math.round(dailyLimit).toLocaleString('id-ID')}) tidak cukup untuk gaya hidup Anda yang butuh Rp ${Math.round(requiredDaily).toLocaleString('id-ID')}/hari. Coba kurangi jajan atau target tabungan.`;
          dailyLimit = requiredDaily; 
        } else {
          const surplus = dailyLimit - requiredDaily;
          aiMessage = `Hebat! Gaya hidup Anda menghabiskan Rp ${Math.round(requiredDaily).toLocaleString('id-ID')}/hari. Anda punya sisa Rp ${Math.round(surplus).toLocaleString('id-ID')} ekstra!`;
        }

        setResult({
          limit: Math.round(dailyLimit),
          food: dailyFood,
          cig: Math.round(dailyCig),
          transport: dailyTransport,
          message: aiMessage
        });

        setIsCalculating(false);
        setStep(5);
      }, 3000);
    }
  };

  const handleBack = () => {
    if (step > 1 && step < 5) setStep(step - 1);
    else router.back();
  };

  return (
    <View className="flex-1 bg-[#EEF3F9]" style={{ paddingTop: insets.top }}>
      
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pt-4 pb-2">
        <Pressable 
          onPress={handleBack}
          className="w-10 h-10 rounded-full bg-white items-center justify-center border border-[#E2EAF3]"
        >
          <Feather name="arrow-left" size={20} color="#0F172A" />
        </Pressable>
        {step < 5 && !isCalculating && (
          <View className="bg-[#E2EAF3] px-3 py-1.5 rounded-full">
            <Text className="text-[12px] font-['Nunito_800ExtraBold'] text-[#475569]">
              Langkah {step} dari 4
            </Text>
          </View>
        )}
      </View>

      {/* Progress Bar */}
      {step < 5 && !isCalculating && (
        <View className="px-6 mt-4">
          <View className="h-1.5 w-full bg-[#E2EAF3] rounded-full overflow-hidden">
            <View 
              className="h-full bg-[#8B5CF6] rounded-full" 
              style={{ width: `${(step / 4) * 100}%` }} 
            />
          </View>
        </View>
      )}

      {/* MAIN CONTENT */}
      <View className="flex-1 px-6">
        {isCalculating ? (
          <View className="flex-1 items-center justify-center mt-20">
            <View className="w-24 h-24 rounded-full bg-[#F3E8FF] items-center justify-center mb-6">
              <MaterialCommunityIcons name="brain" size={48} color="#9333EA" />
            </View>
            <Text className="text-[20px] font-['Nunito_800ExtraBold'] text-[#0F172A] mb-3 text-center">
              AI sedang meracik strategi...
            </Text>
            <Text className="text-[14px] font-['Nunito_600SemiBold'] text-[#64748B] mb-8 text-center px-8 leading-5">
              Menganalisis kebiasaan makan, transportasi, dan gaya hidup Anda untuk menemukan batas ideal yang realistis.
            </Text>
            <ActivityIndicator size="large" color="#9333EA" />
          </View>
        ) : step === 5 && result ? (
          <View className="flex-1 mt-6 mb-10">
            <View className="bg-white rounded-[32px] p-6 mb-6" style={{ shadowColor: '#9333EA', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 5 }}>
              <View className="flex-row items-center mb-4">
                <View className="w-10 h-10 rounded-full bg-[#F0FDF4] items-center justify-center mr-3">
                  <Feather name="check" size={20} color="#10B981" />
                </View>
                <Text className="text-[14px] font-['Nunito_700Bold'] text-[#64748B]">Batas Harian Realistis Anda:</Text>
              </View>
              <Text className="text-[40px] font-['Nunito_800ExtraBold'] text-[#0F172A] mb-6 tracking-tight">
                Rp {result.limit.toLocaleString('id-ID')}
              </Text>
              
              <View className="bg-[#F8FAFC] p-4 rounded-2xl border border-[#F1F5F9] mb-6">
                <Text className="text-[13px] font-['Nunito_600SemiBold'] text-[#475569] leading-5">
                  {result.message}
                </Text>
              </View>

              <Text className="text-[14px] font-['Nunito_800ExtraBold'] text-[#0F172A] mb-3">Rekomendasi Alokasi AI:</Text>
              <View className="gap-3">
                <View className="flex-row justify-between items-center bg-[#FFFBEB] p-3 rounded-xl border border-[#FEF3C7]">
                  <Text className="text-[14px] font-['Nunito_700Bold'] text-[#B45309]">🍛 Makan</Text>
                  <Text className="text-[14px] font-['Nunito_800ExtraBold'] text-[#92400E]">Rp {result.food.toLocaleString('id-ID')}</Text>
                </View>
                {isSmoker && (
                  <View className="flex-row justify-between items-center bg-[#FEF2F2] p-3 rounded-xl border border-[#FEE2E2]">
                    <Text className="text-[14px] font-['Nunito_700Bold'] text-[#B91C1C]">🚬 Rokok</Text>
                    <Text className="text-[14px] font-['Nunito_800ExtraBold'] text-[#991B1B]">Rp {result.cig.toLocaleString('id-ID')}</Text>
                  </View>
                )}
                <View className="flex-row justify-between items-center bg-[#EFF6FF] p-3 rounded-xl border border-[#DBEAFE]">
                  <Text className="text-[14px] font-['Nunito_700Bold'] text-[#1D4ED8]">🏍️ Transportasi</Text>
                  <Text className="text-[14px] font-['Nunito_800ExtraBold'] text-[#1E3A8A]">Rp {result.transport.toLocaleString('id-ID')}</Text>
                </View>
              </View>
            </View>

            <Pressable onPress={() => router.back()}>
              <LinearGradient
                colors={['#8B5CF6', '#6D28D9']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="rounded-2xl h-[56px] items-center justify-center w-full shadow-lg"
              >
                <Text className="text-white text-[16px] font-['Nunito_800ExtraBold']">Terima & Terapkan Limit</Text>
              </LinearGradient>
            </Pressable>
          </View>
        ) : (
          <ScrollView className="flex-1 mt-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
            {/* STEP 1 */}
            {step === 1 && (
              <View className="animate-fade-in">
                <Text className="text-[28px] font-['Nunito_800ExtraBold'] text-[#0F172A] mb-2">Pemasukan Bulanan</Text>
                <Text className="text-[14px] font-['Nunito_600SemiBold'] text-[#64748B] leading-5 pr-4 mb-8">
                  Berapa total estimasi pemasukan Anda bulan ini (Gaji + Bisnis + Uang Jajan)?
                </Text>
                <View className="bg-white rounded-[24px] px-6 h-[80px] justify-center shadow-sm border border-[#F1F5F9] mb-8">
                  <TextInput
                    value={incomeInput.value}
                    onChangeText={incomeInput.onChangeText}
                    keyboardType="numeric"
                    placeholder="Rp 0"
                    className="flex-1 text-[28px] font-['Nunito_800ExtraBold'] text-[#111827]"
                    autoFocus
                  />
                </View>
              </View>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <View className="animate-fade-in">
                <Text className="text-[28px] font-['Nunito_800ExtraBold'] text-[#0F172A] mb-2">Pengeluaran Tetap</Text>
                <Text className="text-[14px] font-['Nunito_600SemiBold'] text-[#64748B] leading-5 pr-4 mb-6">
                  Tulis tagihan yang WAJIB dibayar (Kos, WiFi, Cicilan). Kami akan menjumlahkannya otomatis.
                </Text>
                {fixedExpenses.map((exp) => (
                  <View key={exp.id} className="flex-row items-center gap-3 mb-4">
                    <View className="flex-1 bg-white rounded-2xl px-4 h-[56px] justify-center border border-[#E2EAF3]">
                      <TextInput
                        value={exp.name}
                        onChangeText={(txt) => setFixedExpenses(prev => prev.map(e => e.id === exp.id ? { ...e, name: txt } : e))}
                        placeholder="Nama (Mis: WiFi)"
                        className="flex-1 text-[14px] font-['Nunito_700Bold'] text-[#111827]"
                      />
                    </View>
                    <View className="flex-[1.2] bg-white rounded-2xl px-4 h-[56px] justify-center border border-[#E2EAF3]">
                      <TextInput
                        value={exp.amount}
                        onChangeText={(txt) => handleExpenseChange(exp.id, txt)}
                        keyboardType="numeric"
                        placeholder="Rp 0"
                        className="flex-1 text-[15px] font-['Nunito_800ExtraBold'] text-[#111827]"
                      />
                    </View>
                    <Pressable onPress={() => removeExpense(exp.id)} className="w-10 h-[56px] items-center justify-center bg-[#FEF2F2] rounded-xl">
                      <Feather name="x" size={20} color="#EF4444" />
                    </Pressable>
                  </View>
                ))}
                <Pressable onPress={addExpense} className="flex-row items-center justify-center py-4 border border-dashed border-[#CBD5E1] rounded-2xl mb-8 bg-[#F8FAFC]">
                  <Feather name="plus-circle" size={18} color="#3B82F6" />
                  <Text className="text-[14px] font-['Nunito_700Bold'] text-[#3B82F6] ml-2">Tambah Pengeluaran Wajib</Text>
                </Pressable>
                <View className="flex-row justify-between items-center bg-[#F1F5F9] p-5 rounded-2xl">
                  <Text className="text-[14px] font-['Nunito_700Bold'] text-[#475569]">Total Tagihan:</Text>
                  <Text className="text-[18px] font-['Nunito_800ExtraBold'] text-[#0F172A]">Rp {totalFixedExpense.toLocaleString('id-ID')}</Text>
                </View>
              </View>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <View className="animate-fade-in">
                <Text className="text-[28px] font-['Nunito_800ExtraBold'] text-[#0F172A] mb-2">Gaya Hidup</Text>
                <Text className="text-[14px] font-['Nunito_600SemiBold'] text-[#64748B] leading-5 pr-4 mb-8">
                  Bantu AI mengenali ritme harian Anda agar budget tidak terasa mencekik.
                </Text>

                <Text className="text-[15px] font-['Nunito_800ExtraBold'] text-[#0F172A] mb-3">1. Makan berat berapa kali sehari?</Text>
                <View className="flex-row gap-2 mb-6">
                  {[1, 2, 3, 4].map(num => (
                    <Pressable key={num} onPress={() => setMealsPerDay(num)} className={`flex-1 h-12 rounded-xl items-center justify-center border ${mealsPerDay === num ? 'bg-[#EFF6FF] border-[#3B82F6]' : 'bg-white border-[#E2EAF3]'}`}>
                      <Text className={`text-[15px] font-['Nunito_700Bold'] ${mealsPerDay === num ? 'text-[#1D4ED8]' : 'text-[#64748B]'}`}>{num}x</Text>
                    </Pressable>
                  ))}
                </View>

                <Text className="text-[15px] font-['Nunito_800ExtraBold'] text-[#0F172A] mb-3">Rata-rata biaya 1 porsi makan?</Text>
                <View className="bg-white rounded-2xl px-5 h-[56px] justify-center border border-[#E2EAF3] mb-8">
                  <TextInput
                    value={costPerMealInput.value}
                    onChangeText={costPerMealInput.onChangeText}
                    keyboardType="numeric"
                    placeholder="Rp 20.000"
                    className="flex-1 text-[16px] font-['Nunito_700Bold'] text-[#111827]"
                  />
                </View>

                <Text className="text-[15px] font-['Nunito_800ExtraBold'] text-[#0F172A] mb-3">2. Apakah Anda merokok?</Text>
                <View className="flex-row gap-3 mb-6">
                  <Pressable onPress={() => setIsSmoker(true)} className={`flex-1 h-12 rounded-xl items-center justify-center border ${isSmoker === true ? 'bg-[#FEF2F2] border-[#EF4444]' : 'bg-white border-[#E2EAF3]'}`}>
                    <Text className={`text-[15px] font-['Nunito_700Bold'] ${isSmoker === true ? 'text-[#B91C1C]' : 'text-[#64748B]'}`}>Ya, Merokok</Text>
                  </Pressable>
                  <Pressable onPress={() => setIsSmoker(false)} className={`flex-1 h-12 rounded-xl items-center justify-center border ${isSmoker === false ? 'bg-[#F0FDF4] border-[#10B981]' : 'bg-white border-[#E2EAF3]'}`}>
                    <Text className={`text-[15px] font-['Nunito_700Bold'] ${isSmoker === false ? 'text-[#047857]' : 'text-[#64748B]'}`}>Tidak</Text>
                  </Pressable>
                </View>

                {isSmoker && (
                  <View className="bg-[#FEF2F2] p-4 rounded-2xl border border-[#FEE2E2] mb-8">
                    <Text className="text-[13px] font-['Nunito_700Bold'] text-[#991B1B] mb-2">Harga Sebungkus (Rata-rata)</Text>
                    <View className="bg-white rounded-xl px-4 h-[48px] justify-center border border-[#FCA5A5] mb-3">
                      <TextInput value={cigarettePriceInput.value} onChangeText={cigarettePriceInput.onChangeText} keyboardType="numeric" className="flex-1 font-['Nunito_700Bold'] text-[#7F1D1D]" />
                    </View>
                    <Text className="text-[13px] font-['Nunito_700Bold'] text-[#991B1B] mb-2">Biasanya habis dalam berapa hari?</Text>
                    <View className="bg-white rounded-xl px-4 h-[48px] justify-center border border-[#FCA5A5]">
                      <TextInput value={cigaretteDays} onChangeText={setCigaretteDays} keyboardType="numeric" placeholder="Misal: 2" className="flex-1 font-['Nunito_700Bold'] text-[#7F1D1D]" />
                    </View>
                  </View>
                )}

                <Text className="text-[15px] font-['Nunito_800ExtraBold'] text-[#0F172A] mb-3">3. Transportasi Utama Harian?</Text>
                <View className="flex-row flex-wrap gap-2 mb-4">
                  {['Motor', 'Mobil', 'Umum', 'Ojol'].map(t => (
                    <Pressable key={t} onPress={() => setTransport(t)} className={`px-5 py-3 rounded-full border ${transport === t ? 'bg-[#0F172A] border-[#0F172A]' : 'bg-white border-[#E2EAF3]'}`}>
                      <Text className={`text-[14px] font-['Nunito_700Bold'] ${transport === t ? 'text-white' : 'text-[#64748B]'}`}>{t}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <View className="animate-fade-in">
                <Text className="text-[28px] font-['Nunito_800ExtraBold'] text-[#0F172A] mb-2">Target Tabungan</Text>
                <Text className="text-[14px] font-['Nunito_600SemiBold'] text-[#64748B] leading-5 pr-4 mb-8">
                  Terakhir, berapa uang yang WAJIB Anda sisihkan/investasikan bulan ini?
                </Text>
                <View className="bg-white rounded-[24px] px-6 h-[80px] justify-center shadow-sm border border-[#F1F5F9] mb-8">
                  <TextInput
                    value={savingInput.value}
                    onChangeText={savingInput.onChangeText}
                    keyboardType="numeric"
                    placeholder="Rp 0"
                    className="flex-1 text-[28px] font-['Nunito_800ExtraBold'] text-[#111827]"
                    autoFocus
                  />
                </View>
              </View>
            )}
          </ScrollView>
        )}
      </View>

      {/* FOOTER BUTTON */}
      {step < 5 && !isCalculating && (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="px-6 pb-8 pt-2 bg-[#EEF3F9]">
          <Pressable onPress={handleNext}>
            <LinearGradient
              colors={['#0F172A', '#1E293B']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="rounded-2xl h-[60px] items-center justify-center flex-row shadow-lg"
            >
              <Text className="text-white text-[16px] font-['Nunito_800ExtraBold'] mr-2">
                {step === 4 ? 'Kalkulasi Sekarang' : 'Selanjutnya'}
              </Text>
              <Feather name={step === 4 ? "cpu" : "arrow-right"} size={20} color="white" />
            </LinearGradient>
          </Pressable>
        </KeyboardAvoidingView>
      )}

    </View>
  );
}
