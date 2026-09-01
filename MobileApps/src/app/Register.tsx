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
import { Feather, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function RegisterScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [form, setForm] = useState({
    phone: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (field: string) => (val: string) =>
    setForm((prev) => ({ ...prev, [field]: val }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.phone) e.phone = 'Nomor telepon wajib diisi.';
    else if (!/^\d{9,15}$/.test(form.phone.replace(/\s/g, '')))
      e.phone = 'Nomor telepon tidak valid.';
    if (!form.username) e.username = 'Username wajib diisi.';
    if (!form.email) e.email = 'Email wajib diisi.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Format email tidak valid.';
    if (!form.password) e.password = 'Kata sandi wajib diisi.';
    else if (form.password.length < 8) e.password = 'Kata sandi minimal 8 karakter.';
    if (!form.confirmPassword) e.confirmPassword = 'Konfirmasi kata sandi wajib diisi.';
    else if (form.password !== form.confirmPassword)
      e.confirmPassword = 'Kata sandi tidak cocok.';
    return e;
  };

  const handleRegister = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setIsLoading(true);
    // Simulasi proses daftar
    setTimeout(() => {
      setIsLoading(false);
      router.replace('/login');
    }, 1500);
  };

  const InputField = ({
    field,
    icon,
    placeholder,
    keyboardType = 'default',
    secureEntry = false,
    toggleVisible,
    isVisible,
    autoCapitalize = 'none',
  }: {
    field: keyof typeof form;
    icon: string;
    placeholder: string;
    keyboardType?: any;
    secureEntry?: boolean;
    toggleVisible?: () => void;
    isVisible?: boolean;
    autoCapitalize?: any;
  }) => {
    const hasError = !!errors[field];
    const hasValue = !!form[field];

    return (
      <View style={{ marginBottom: hasError ? 6 : 14 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: hasError ? '#FEF2F2' : '#E2EAF3',
            borderRadius: 50,
            paddingHorizontal: 18,
            height: 54,
            borderWidth: hasError ? 1.5 : 0,
            borderColor: hasError ? '#FCA5A5' : 'transparent',
          }}
        >
          <Feather
            name={icon as any}
            size={18}
            color={hasError ? '#EF4444' : hasValue ? '#0284C7' : '#94A3B8'}
            style={{ marginRight: 10 }}
          />
          <TextInput
            value={form[field]}
            onChangeText={set(field)}
            placeholder={placeholder}
            placeholderTextColor="#94A3B8"
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            secureTextEntry={secureEntry && !isVisible}
            style={{
              flex: 1,
              fontSize: 15,
              fontFamily: 'Nunito_600SemiBold',
              color: '#0F172A',
              padding: 0,
            }}
          />
          {toggleVisible && (
            <Pressable onPress={toggleVisible} hitSlop={12}>
              <Feather
                name={isVisible ? 'eye-off' : 'eye'}
                size={18}
                color="#94A3B8"
              />
            </Pressable>
          )}
        </View>
        {hasError && (
          <Text
            style={{
              color: '#EF4444',
              fontSize: 11,
              fontFamily: 'Nunito_600SemiBold',
              marginTop: 4,
              marginLeft: 18,
              marginBottom: 8,
            }}
          >
            {errors[field]}
          </Text>
        )}
      </View>
    );
  };

  return (
    <View className="flex-1" style={{ backgroundColor: '#EEF3F9' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: insets.bottom + 24,
          }}
        >
          {/* ── Hero Area ── */}
          <View
            style={{
              paddingTop: insets.top + 24,
              alignItems: 'center',
              position: 'relative',
              paddingBottom: 28,
            }}
          >
            {/* Dekorasi Kiri Atas */}
            <View
              style={{ position: 'absolute', top: insets.top + 10, left: 16 }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-end',
                  gap: 3,
                  marginBottom: 4,
                }}
              >
                <View
                  style={{
                    width: 7, height: 14,
                    backgroundColor: '#93C5FD', borderRadius: 3,
                  }}
                />
                <View
                  style={{
                    width: 7, height: 22,
                    backgroundColor: '#60A5FA', borderRadius: 3,
                  }}
                />
                <View
                  style={{
                    width: 7, height: 18,
                    backgroundColor: '#3B82F6', borderRadius: 3,
                  }}
                />
              </View>
              <View
                style={{
                  width: 26, height: 26, borderRadius: 13,
                  backgroundColor: '#FCD34D',
                  borderWidth: 2.5, borderColor: '#F59E0B',
                  alignItems: 'center', justifyContent: 'center',
                  marginLeft: 8,
                }}
              >
                <Text style={{ fontSize: 11, fontWeight: '900', color: '#92400E' }}>$</Text>
              </View>
              <Text style={{ fontSize: 13, marginTop: 4, marginLeft: 30 }}>✦</Text>
            </View>

            {/* Dekorasi Kanan Atas */}
            <View
              style={{
                position: 'absolute',
                top: insets.top + 6,
                right: 18,
                alignItems: 'center',
              }}
            >
              <Ionicons name="stats-chart" size={28} color="#60A5FA" style={{ marginBottom: 4 }} />
              <View
                style={{
                  width: 38, height: 38, borderRadius: 19,
                  backgroundColor: '#FCD34D',
                  borderWidth: 3, borderColor: '#F59E0B',
                  alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: '900', color: '#92400E' }}>$</Text>
              </View>
              <View
                style={{
                  width: 22, height: 22, borderRadius: 11,
                  backgroundColor: '#6EE7B7',
                  borderWidth: 2, borderColor: '#10B981',
                  alignItems: 'center', justifyContent: 'center',
                  alignSelf: 'flex-start', marginTop: 4,
                }}
              >
                <Text style={{ fontSize: 9, fontWeight: '900', color: '#065F46' }}>$</Text>
              </View>
              <Text style={{ fontSize: 10, color: '#FCD34D', marginTop: 2 }}>✦</Text>
            </View>

            {/* Lingkaran dekoratif */}
            <View
              style={{
                position: 'absolute', top: insets.top, left: 0,
                width: 120, height: 120, borderRadius: 60,
                borderWidth: 1.5,
                borderColor: 'rgba(147,197,253,0.35)',
                transform: [{ translateX: -60 }, { translateY: -30 }],
              }}
            />
            <View
              style={{
                position: 'absolute', top: insets.top + 40, right: 0,
                width: 80, height: 80, borderRadius: 40,
                borderWidth: 1.5,
                borderColor: 'rgba(147,197,253,0.25)',
                transform: [{ translateX: 30 }],
              }}
            />

            {/* Logo */}
            <LinearGradient
              colors={['#0369A1', '#0EA5E9']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: 72, height: 72, borderRadius: 20,
                alignItems: 'center', justifyContent: 'center',
                marginBottom: 14,
                shadowColor: '#0369A1',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.3, shadowRadius: 12, elevation: 8,
              }}
            >
              <FontAwesome5 name="magic" size={30} color="white" />
            </LinearGradient>

            <Text
              style={{
                fontSize: 28,
                fontFamily: 'Nunito_800ExtraBold',
                color: '#0F172A',
                letterSpacing: -0.3,
              }}
            >
              FinGenius
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Nunito_600SemiBold',
                color: '#64748B',
                marginTop: 3,
              }}
            >
              Asisten Keuangan Pribadimu
            </Text>
          </View>

          {/* ── Form Area ── */}
          <View style={{ paddingHorizontal: 24 }}>
            <Text
              style={{
                fontSize: 24,
                fontFamily: 'Nunito_800ExtraBold',
                color: '#0F172A',
                marginBottom: 4,
              }}
            >
              Buat Akun Baru 🚀
            </Text>
            <Text
              style={{
                fontSize: 13,
                fontFamily: 'Nunito_600SemiBold',
                color: '#94A3B8',
                marginBottom: 24,
              }}
            >
              Daftar untuk mulai mengelola keuanganmu
            </Text>

            {/* Input Fields */}
            <InputField
              field="phone"
              icon="phone"
              placeholder="Nomor Telepon"
              keyboardType="phone-pad"
            />
            <InputField
              field="username"
              icon="user"
              placeholder="Username"
              autoCapitalize="words"
            />
            <InputField
              field="email"
              icon="mail"
              placeholder="Email"
              keyboardType="email-address"
            />
            <InputField
              field="password"
              icon="lock"
              placeholder="Kata Sandi"
              secureEntry={true}
              isVisible={isPasswordVisible}
              toggleVisible={() => setIsPasswordVisible(!isPasswordVisible)}
            />
            <InputField
              field="confirmPassword"
              icon="check-circle"
              placeholder="Konfirmasi Kata Sandi"
              secureEntry={true}
              isVisible={isConfirmVisible}
              toggleVisible={() => setIsConfirmVisible(!isConfirmVisible)}
            />

            {/* Tombol Daftar */}
            <Pressable
              onPress={handleRegister}
              disabled={isLoading}
              style={{ marginTop: 10, marginBottom: 20, opacity: isLoading ? 0.8 : 1 }}
            >
              <LinearGradient
                colors={['#1D4ED8', '#0369A1']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  borderRadius: 50, height: 54,
                  alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Text
                  style={{
                    color: '#fff', fontSize: 16,
                    fontFamily: 'Nunito_800ExtraBold',
                    letterSpacing: 0.3,
                  }}
                >
                  {isLoading ? 'Mendaftarkan...' : 'Daftar Sekarang'}
                </Text>
              </LinearGradient>
            </Pressable>

            {/* Divider */}
            <View
              style={{
                flexDirection: 'row', alignItems: 'center', marginBottom: 20,
              }}
            >
              <View style={{ flex: 1, height: 1, backgroundColor: '#CBD5E1' }} />
              <Text
                style={{
                  marginHorizontal: 14, color: '#94A3B8',
                  fontSize: 13, fontFamily: 'Nunito_600SemiBold',
                }}
              >
                atau
              </Text>
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

            {/* Masuk */}
            <Pressable
              onPress={() => router.replace('/login')}
              style={{
                borderRadius: 50, height: 54,
                alignItems: 'center', justifyContent: 'center',
                borderWidth: 1.5, borderColor: '#0369A1',
              }}
            >
              <Text
                style={{
                  color: '#0369A1', fontSize: 15,
                  fontFamily: 'Nunito_800ExtraBold',
                }}
              >
                Sudah punya akun? Masuk
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}