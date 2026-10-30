import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const DUMMY_EMAIL = 'aditya@fingeniusai.com';
const DUMMY_PASSWORD = 'Password123';

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (
    credentials: { email: string; password: string } = { email, password },
  ) => {
    setError('');
    if (!credentials.email || !credentials.password) {
      setError('Email dan kata sandi tidak boleh kosong.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (credentials.email === DUMMY_EMAIL && credentials.password === DUMMY_PASSWORD) {
        router.replace('/(tabs)');
      } else {
        setError('Email atau kata sandi salah.');
      }
    }, 1200);
  };

  const handleQuickLogin = () => {
    if (isLoading) return;

    setEmail(DUMMY_EMAIL);
    setPassword(DUMMY_PASSWORD);
    setIsPasswordVisible(false);
    handleLogin({ email: DUMMY_EMAIL, password: DUMMY_PASSWORD });
  };

  return (
    <View className="flex-1" style={{ backgroundColor: '#EEF3F9' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        
        
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: insets.bottom + 10 }}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Hero Area ── */}
          <View style={{ paddingTop: insets.top + 24, alignItems: 'center', position: 'relative', paddingBottom: 32 }}>

            {/* Dekorasi Kiri Atas */}
            <View style={{ position: 'absolute', top: insets.top + 10, left: 16, alignItems: 'center' }}>
              {/* Grafik batang kecil */}
              <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 3, marginBottom: 4 }}>
                <View style={{ width: 7, height: 14, backgroundColor: '#93C5FD', borderRadius: 3 }} />
                <View style={{ width: 7, height: 22, backgroundColor: '#60A5FA', borderRadius: 3 }} />
                <View style={{ width: 7, height: 18, backgroundColor: '#3B82F6', borderRadius: 3 }} />
              </View>
              {/* Koin kecil */}
              <View style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: '#FCD34D', borderWidth: 2.5, borderColor: '#F59E0B', alignItems: 'center', justifyContent: 'center', marginLeft: 8 }}>
                <Text style={{ fontSize: 11, fontWeight: '900', color: '#92400E' }}>$</Text>
              </View>
              {/* Bintang kecil */}
              <Text style={{ fontSize: 13, marginTop: 4, marginLeft: 30 }}>✦</Text>
            </View>

            {/* Dekorasi Kanan Atas */}
            <View style={{ position: 'absolute', top: insets.top + 6, right: 18, alignItems: 'center' }}>
              {/* Ikon chart */}
              <View style={{ marginBottom: 4 }}>
                <Ionicons name="stats-chart" size={28} color="#60A5FA" />
              </View>
              {/* Koin besar */}
              <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: '#FCD34D', borderWidth: 3, borderColor: '#F59E0B', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 16, fontWeight: '900', color: '#92400E' }}>$</Text>
              </View>
              {/* Koin kecil */}
              <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: '#6EE7B7', borderWidth: 2, borderColor: '#10B981', alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-start', marginTop: 4 }}>
                <Text style={{ fontSize: 9, fontWeight: '900', color: '#065F46' }}>$</Text>
              </View>
              {/* Bintang */}
              <Text style={{ fontSize: 10, color: '#FCD34D', marginTop: 2 }}>✦</Text>
            </View>

            {/* Garis dekoratif lengkung (SVG-like dengan View) */}
            <View style={{
              position: 'absolute', top: insets.top, left: 0,
              width: 120, height: 120, borderRadius: 60,
              borderWidth: 1.5, borderColor: 'rgba(147,197,253,0.35)',
              transform: [{ translateX: -60 }, { translateY: -30 }],
            }} />
            <View style={{
              position: 'absolute', top: insets.top + 40, right: 0,
              width: 80, height: 80, borderRadius: 40,
              borderWidth: 1.5, borderColor: 'rgba(147,197,253,0.25)',
              transform: [{ translateX: 30 }],
            }} />

            {/* Logo Ikon */}
            <LinearGradient
              colors={['#0369A1', '#0EA5E9']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: 72, height: 72, borderRadius: 20,
                alignItems: 'center', justifyContent: 'center',
                marginBottom: 14,
                shadowColor: '#0369A1', shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.3, shadowRadius: 12, elevation: 8,
              }}
            >
              <FontAwesome5 name="magic" size={30} color="white" />
            </LinearGradient>

            {/* Nama Aplikasi */}
            <Text style={{ fontSize: 28, fontFamily: 'Nunito_800ExtraBold', color: '#0F172A', letterSpacing: -0.3 }}>
              FinGenius
            </Text>
            <Text style={{ fontSize: 14, fontFamily: 'Nunito_600SemiBold', color: '#64748B', marginTop: 3 }}>
              Asisten Keuangan Pribadimu
            </Text>
          </View>

          {/* ── Form Area ── */}
          <View style={{ paddingHorizontal: 24 }}>

            {/* Heading */}
            <Text style={{ fontSize: 24, fontFamily: 'Nunito_800ExtraBold', color: '#0F172A', marginBottom: 4 }}>
              Selamat Datang! 👋
            </Text>
            <Text style={{ fontSize: 13, fontFamily: 'Nunito_600SemiBold', color: '#94A3B8', marginBottom: 24 }}>
              Masuk untuk mulai mengelola keuanganmu
            </Text>

            {/* Error */}
            {!!error && (
              <View style={{ backgroundColor: '#FEF2F2', borderRadius: 14, padding: 12, marginBottom: 16, flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
                <Feather name="alert-circle" size={15} color="#EF4444" style={{ marginTop: 1 }} />
                <Text style={{ color: '#DC2626', fontSize: 13, fontFamily: 'Nunito_600SemiBold', flex: 1 }}>{error}</Text>
              </View>
            )}

            {/* Input Email */}
            <View style={{
              flexDirection: 'row', alignItems: 'center',
              backgroundColor: '#E2EAF3',
              borderRadius: 50, paddingHorizontal: 18, height: 54, marginBottom: 14,
            }}>
              <Feather name="mail" size={18} color="#94A3B8" style={{ marginRight: 10 }} />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Email atau Nomor HP"
                placeholderTextColor="#94A3B8"
                keyboardType="email-address"
                autoCapitalize="none"
                style={{ flex: 1, fontSize: 15, fontFamily: 'Nunito_600SemiBold', color: '#0F172A', padding: 0 }}
              />
            </View>

            {/* Input Password */}
            <View style={{
              flexDirection: 'row', alignItems: 'center',
              backgroundColor: '#E2EAF3',
              borderRadius: 50, paddingHorizontal: 18, height: 54, marginBottom: 10,
            }}>
              <Feather name="lock" size={18} color="#94A3B8" style={{ marginRight: 10 }} />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Kata Sandi"
                placeholderTextColor="#94A3B8"
                secureTextEntry={!isPasswordVisible}
                style={{ flex: 1, fontSize: 15, fontFamily: 'Nunito_600SemiBold', color: '#0F172A', padding: 0 }}
              />
              <Pressable onPress={() => setIsPasswordVisible(!isPasswordVisible)} hitSlop={12}>
                <Feather name={isPasswordVisible ? 'eye-off' : 'eye'} size={18} color="#94A3B8" />
              </Pressable>
            </View>

            {/* Lupa Password */}
            <Pressable style={{ alignItems: 'flex-end', marginBottom: 28 }}>
              <Text style={{ fontSize: 13, fontFamily: 'Nunito_700Bold', color: '#0284C7' }}>
                Lupa kata sandi?
              </Text>
            </Pressable>

            {/* Tombol Masuk */}
            <Pressable onPress={() => handleLogin()} disabled={isLoading} style={{ marginBottom: 20, opacity: isLoading ? 0.8 : 1 }}>
              <LinearGradient
                colors={['#1D4ED8', '#0369A1']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ borderRadius: 50, height: 54, alignItems: 'center', justifyContent: 'center' }}
              >
                <Text style={{ color: '#fff', fontSize: 16, fontFamily: 'Nunito_800ExtraBold', letterSpacing: 0.3 }}>
                  {isLoading ? 'Memverifikasi...' : 'Masuk'}
                </Text>
              </LinearGradient>
            </Pressable>

            {/* Divider */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
              <View style={{ flex: 1, height: 1, backgroundColor: '#CBD5E1' }} />
              <Text style={{ marginHorizontal: 14, color: '#94A3B8', fontSize: 13, fontFamily: 'Nunito_600SemiBold' }}>atau</Text>
              <View style={{ flex: 1, height: 1, backgroundColor: '#CBD5E1' }} />
            </View>

            {/* Tombol Masuk dengan Google */}
            <Pressable
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#fff',
                borderRadius: 50,
                height: 54,
                marginBottom: 12,
                borderWidth: 1.5,
                borderColor: '#E2EAF3',
                gap: 10,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.06,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              {/* Logo Google manual dengan 4 warna */}
              <View style={{ width: 22, height: 22 }}>
                <View style={{ flexDirection: 'row', flex: 1 }}>
                  <View style={{ flex: 1, backgroundColor: '#4285F4', borderTopLeftRadius: 11 }} />
                  <View style={{ flex: 1, backgroundColor: '#EA4335', borderTopRightRadius: 11 }} />
                </View>
                <View style={{ flexDirection: 'row', flex: 1 }}>
                  <View style={{ flex: 1, backgroundColor: '#34A853', borderBottomLeftRadius: 11 }} />
                  <View style={{ flex: 1, backgroundColor: '#FBBC05', borderBottomRightRadius: 11 }} />
                </View>
              </View>
              <Text style={{ fontSize: 15, fontFamily: 'Nunito_700Bold', color: '#374151' }}>
                Masuk dengan Google
              </Text>
            </Pressable>

            {/* Tombol Daftar */}
            <Pressable
              onPress={() => router.push('/Register')}
              style={{
                borderRadius: 50, height: 54, alignItems: 'center', justifyContent: 'center',
                borderWidth: 1.5, borderColor: '#0369A1', marginBottom: 24,
              }}>
              <Text style={{ color: '#0369A1', fontSize: 15, fontFamily: 'Nunito_800ExtraBold' }}>
                Daftar Sekarang
              </Text>
            </Pressable>

            {/* Info Prototype */}
            <View style={{
              backgroundColor: '#F5F3FF',
              borderColor: '#DDD6FE',
              borderWidth: 1,
              borderRadius: 18,
              padding: 16,
              flexDirection: 'row',
              alignItems: 'flex-start',
              gap: 12,
            }}>
              <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: '#E9D5FF', alignItems: 'center', justifyContent: 'center' }}>
                <MaterialCommunityIcons name="robot-outline" size={18} color="#7C3AED" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: '#5B21B6', fontSize: 14, fontFamily: 'Nunito_800ExtraBold', marginBottom: 3 }}>
                  Prototype Mode
                </Text>
                <Text style={{ color: '#6B5A8E', fontSize: 12, lineHeight: 18, fontFamily: 'Nunito_600SemiBold' }}>
                  Coba aplikasi menggunakan akun demo tanpa mengisi formulir.
                </Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Masuk dengan akun demo"
                  onPress={handleQuickLogin}
                  disabled={isLoading}
                  style={{
                    alignSelf: 'flex-start',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 7,
                    backgroundColor: isLoading ? '#A78BFA' : '#7C3AED',
                    borderRadius: 12,
                    paddingHorizontal: 14,
                    height: 38,
                    marginTop: 12,
                    opacity: isLoading ? 0.8 : 1,
                  }}
                >
                  <Text style={{ color: '#FFFFFF', fontSize: 12, fontFamily: 'Nunito_800ExtraBold' }}>
                    {isLoading ? 'Memverifikasi...' : 'Masuk dengan akun demo'}
                  </Text>
                  {!isLoading && <Feather name="arrow-right" size={14} color="#FFFFFF" />}
                </Pressable>
              </View>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
