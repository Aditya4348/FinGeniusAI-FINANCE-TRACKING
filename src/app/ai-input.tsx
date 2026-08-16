import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Feather, FontAwesome, Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Badge } from '@/components/FinanceUI';
import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from 'react-native-reanimated';

export default function AiInputScreen() {
  const router = useRouter();
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [response, setResponse] = useState<any>(null);

  const translateY = useSharedValue(0);

  // Fungsi untuk menutup modal
  const closeModal = () => {
    router.back();
  };

  // Konfigurasi Gesture (Geser ke bawah)
  const panGesture = Gesture.Pan()
    .onChange((event) => {
      if (event.translationY > 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      if (event.translationY > 150 || event.velocityY > 500) {
        // Jika digeser cukup jauh atau kencang ke bawah, tutup modal
        translateY.value = withSpring(800, { velocity: event.velocityY });
        runOnJS(closeModal)();
      } else {
        // Jika tidak cukup jauh, kembalikan ke posisi semula
        translateY.value = withSpring(0);
      }
    });

  // Animasi Style
  const rBottomSheetStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const handleSend = () => {
    if (!inputText.trim()) return;
    
    setIsProcessing(true);
    // Simulate AI processing delay
    setTimeout(() => {
      setIsProcessing(false);
      setResponse({
        category: 'Makanan & Minuman',
        amount: 'Rp 10.000',
        wallet: 'DANA',
        remaining: 'Rp 35.000'
      });
      setInputText('');
    }, 1500);
  };

  return (
    <GestureHandlerRootView className="flex-1">
      <KeyboardAvoidingView 
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 25}
        className="flex-1"
      >
        <View className="flex-1 justify-end">
          {/* Backdrop Blur Effect - Bisa ditekan untuk menutup juga */}
          <Pressable className="absolute inset-0" onPress={closeModal}>
            <BlurView intensity={30} tint="dark" className="flex-1" />
          </Pressable>
          
          {/* Bottom Sheet Container */}
          <GestureDetector gesture={panGesture}>
            <Animated.View 
              className="bg-white rounded-t-[32px] p-6 pb-10 shadow-lg elevation-lg h-[85%]" 
              style={rBottomSheetStyle}
            >
              
              {/* Drag Handle (Garis penanda untuk di-swipe) */}
              <View className="w-12 h-1.5 bg-[#E5E5EA] rounded-full self-center mb-6" />

              {/* Header */}
              <View className="flex-row justify-between items-center mb-6">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-full bg-[#F4F3FF] items-center justify-center mr-3">
                    <FontAwesome name="magic" size={20} color="#5925DC" />
                  </View>
                  <Text className="text-lg font-['Nunito_800ExtraBold'] text-black">FinGenius AI</Text>
                </View>
              </View>

              {/* AI Response Area */}
              <ScrollView className="flex-1 mb-4" showsVerticalScrollIndicator={false}>
                {!isProcessing && !response && (
                  <View className="bg-[#F2F2F7] rounded-2xl rounded-tl-none p-4 self-start max-w-[85%]">
                    <Text className="text-sm font-['Nunito_600SemiBold'] text-black">
                      Halo Aditya! Ada pengeluaran atau pemasukan yang mau saya catat hari ini?
                    </Text>
                  </View>
                )}

                {isProcessing && (
                  <View className="bg-[#F2F2F7] rounded-2xl rounded-tl-none p-4 self-start flex-row items-center">
                    <Text className="text-sm font-['Nunito_600SemiBold'] text-[#8E8E93] mr-2">
                      Sedang memproses...
                    </Text>
                    <FontAwesome name="circle-o-notch" size={14} color="#8E8E93" />
                  </View>
                )}

                {response && (
                  <View className="bg-[#ECFDF3] border border-[#D1FADF] rounded-2xl rounded-tl-none p-4 self-start w-full">
                    <Text className="text-[13px] font-['Nunito_700Bold'] text-[#027A48] mb-2">
                      Berhasil dicatat!
                    </Text>
                    <View className="flex-row items-center justify-between mb-1">
                      <Text className="text-sm font-['Nunito_600SemiBold'] text-black">{response.category}</Text>
                      <Text className="text-sm font-['Nunito_700Bold'] text-black">-{response.amount}</Text>
                    </View>
                    <View className="flex-row items-center mb-3">
                      <Text className="text-[11px] font-['Nunito_600SemiBold'] text-[#8E8E93]">Sumber: </Text>
                      <Badge text={response.wallet} color="#EFF8FF" textColor="#175CD3" />
                    </View>
                    <View className="h-[1px] bg-[#D1FADF] w-full mb-2" />
                    <Text className="text-xs font-['Nunito_600SemiBold'] text-[#027A48]">
                      Sisa jatah harianmu: <Text className="font-['Nunito_800ExtraBold']">{response.remaining}</Text>
                    </Text>
                  </View>
                )}
              </ScrollView>

              {/* Input Area */}
              <View className="flex-row items-end">
                <View className="flex-1 bg-[#F2F2F7] rounded-3xl pt-3 pb-3 px-4 mr-3 min-h-[50px] max-h-[120px] flex-row items-center">
                  <TextInput
                    className="flex-1 text-[15px] font-['Nunito_600SemiBold'] text-black p-0"
                    placeholder="Beli baso 10k pake Dana..."
                    placeholderTextColor="#8E8E93"
                    multiline
                    value={inputText}
                    onChangeText={setInputText}
                  />
                  <Pressable className="ml-2">
                    <Ionicons name="camera-outline" size={24} color="#8E8E93" />
                  </Pressable>
                </View>
                
                {inputText.trim() ? (
                  <Pressable 
                    onPress={handleSend}
                    className="w-[50px] h-[50px] rounded-full bg-black justify-center items-center"
                  >
                    <Ionicons name="send" size={20} color="white" style={{ marginLeft: 3 }} />
                  </Pressable>
                ) : (
                  <Pressable className="w-[50px] h-[50px] rounded-full bg-[#F4F3FF] justify-center items-center">
                    <Ionicons name="mic" size={24} color="#5925DC" />
                  </Pressable>
                )}
              </View>
              
            </Animated.View>
          </GestureDetector>
        </View>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
}
