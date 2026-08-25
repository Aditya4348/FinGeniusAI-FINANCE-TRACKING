import { View, Text, Pressable, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    icon: (
      <View className="w-48 h-48 rounded-full bg-white/20 items-center justify-center">
        <Ionicons name="wallet" size={90} color="white" />
      </View>
    ),
    title: 'Pantau Semua\nKeuanganmu',
    desc: 'Kelola saldo BCA, DANA, Cash, dan semua rekening lainnya dalam satu tempat yang rapi dan mudah dipahami.',
    colors: ['#0369A1', '#0284C7'] as [string, string],
  },
  {
    id: '2',
    icon: (
      <View className="w-48 h-48 rounded-full bg-white/20 items-center justify-center">
        <FontAwesome5 name="magic" size={80} color="white" />
      </View>
    ),
    title: 'Asisten AI\nSiap Membantumu',
    desc: 'Cukup bilang "Beli baso 10k pake Dana" dan AI kami langsung mencatat serta mengkategorikannya untukmu.',
    colors: ['#6D28D9', '#8B5CF6'] as [string, string],
  },
  {
    id: '3',
    icon: (
      <View className="w-48 h-48 rounded-full bg-white/20 items-center justify-center">
        <MaterialCommunityIcons name="target" size={90} color="white" />
      </View>
    ),
    title: 'Capai Target\nKeuanganmu',
    desc: 'Atur jatah harian, pantau tabungan, dan raih kebebasan finansialmu bersama FinGenius.',
    colors: ['#065F46', '#059669'] as [string, string],
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = async () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      await handleFinish();
    }
  };

  const handleFinish = async () => {
    await AsyncStorage.setItem('onboarding_done', 'true');
    router.replace('/login');
  };

  const renderSlide = ({ item }: { item: typeof slides[0] }) => (
    <LinearGradient colors={item.colors} style={{ width }} className="flex-1 items-center justify-center px-8">
      <View className="items-center mb-12">
        {item.icon}
      </View>
      <Text className="text-white text-[32px] font-['Nunito_800ExtraBold'] text-center mb-4 leading-tight">
        {item.title}
      </Text>
      <Text className="text-white/80 text-[16px] font-['Nunito_600SemiBold'] text-center leading-relaxed">
        {item.desc}
      </Text>
    </LinearGradient>
  );

  return (
    <View className="flex-1">
      {/* Skip Button */}
      <Pressable
        onPress={handleFinish}
        className="absolute top-14 right-6 z-10 bg-white/20 px-4 py-2 rounded-full"
      >
        <Text className="text-white font-['Nunito_700Bold'] text-sm">Lewati</Text>
      </Pressable>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          setCurrentIndex(Math.round(e.nativeEvent.contentOffset.x / width));
        }}
      />

      {/* Bottom Control Area */}
      <View className="absolute bottom-0 left-0 right-0 pb-14 pt-8 items-center px-8">
        {/* Pager Dots */}
        <View className="flex-row items-center mb-8">
          {slides.map((_, i) => (
            <View
              key={i}
              className="h-2 rounded-full mx-1"
              style={{
                width: currentIndex === i ? 24 : 8,
                backgroundColor: currentIndex === i ? 'white' : 'rgba(255,255,255,0.4)',
              }}
            />
          ))}
        </View>

        {/* Next / Mulai Button */}
        <Pressable
          onPress={handleNext}
          className="bg-white w-full py-4 rounded-2xl items-center"
        >
          <Text
            className="text-[16px] font-['Nunito_800ExtraBold']"
            style={{ color: slides[currentIndex].colors[0] }}
          >
            {currentIndex === slides.length - 1 ? 'Mulai Sekarang 🚀' : 'Lanjut'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
