import {
  View,
  Text,
  ScrollView,
  Pressable,
  Modal,
  TextInput,
  Alert,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect, useCallback } from "react";
import { useRupiahInput } from "@/hooks/useRupiahInput";
import { useAuth } from "@/context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";

const INITIAL_WALLETS = [
  {
    id: "1",
    name: "BCA Utama",
    type: "Bank",
    balance: "Rp 14.568.600",
    number: "**** 8821",
    icon: "bank",
    color1: "#005AAA",
    color2: "#003B73",
  },
  {
    id: "2",
    name: "Bank Jago",
    type: "Bank",
    balance: "Rp 8.420.000",
    number: "**** 4022",
    icon: "bank",
    color1: "#F97316",
    color2: "#C2410C",
  },
  {
    id: "3",
    name: "GoPay",
    type: "E-Wallet",
    balance: "Rp 1.250.500",
    number: "+62 812 ****",
    icon: "wallet",
    color1: "#00AED6",
    color2: "#007C99",
  },
  {
    id: "4",
    name: "Tunai",
    type: "Cash",
    balance: "Rp 850.000",
    number: "Dompet Fisik",
    icon: "cash",
    color1: "#10B981",
    color2: "#047857",
  },
];

export default function WalletScreen() {
  const insets = useSafeAreaInsets();
  const { refetchUser } = useAuth();
  const queryClient = useQueryClient();
  const [wallets, setWallets] = useState(INITIAL_WALLETS);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [type, setType] = useState("Bank"); // Bank | E-Wallet | Cash
  const balanceInput = useRupiahInput("");
  const [number, setNumber] = useState("");

  const loadWallets = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem("user_wallets");
      if (stored) {
        setWallets(JSON.parse(stored));
      }
    } catch (e) {
      console.log("Failed to load wallets");
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        refetchUser(),
        queryClient.invalidateQueries(),
        loadWallets(),
      ]);
    } catch (err) {
      console.warn("Gagal me-refresh dompet:", err);
    } finally {
      setRefreshing(false);
    }
  }, [refetchUser, queryClient, loadWallets]);

  useEffect(() => {
    loadWallets();
  }, [loadWallets]);

  const saveWallets = async (newWallets: any) => {
    try {
      setWallets(newWallets);
      await AsyncStorage.setItem("user_wallets", JSON.stringify(newWallets));
    } catch (e) {
      console.log("Failed to save wallets");
    }
  };

  const handleAddWallet = () => {
    if (!name || !balanceInput.rawValue) {
      Alert.alert("Gagal", "Nama dan Saldo wajib diisi!");
      return;
    }

    let color1 = "#475569";
    let color2 = "#1E293B";
    let icon = "wallet";

    if (type === "Bank") {
      color1 = "#8B5CF6";
      color2 = "#5B21B6";
      icon = "bank";
    } else if (type === "E-Wallet") {
      color1 = "#0EA5E9";
      color2 = "#0369A1";
      icon = "cellphone";
    } else if (type === "Cash") {
      color1 = "#10B981";
      color2 = "#047857";
      icon = "cash";
    }

    const newWallet = {
      id: Date.now().toString(),
      name,
      type,
      balance: balanceInput.value,
      number: number || "-",
      icon,
      color1,
      color2,
    };

    saveWallets([...wallets, newWallet]);
    setIsModalVisible(false);
    resetForm();
  };

  const resetForm = () => {
    setName("");
    setType("Bank");
    balanceInput.reset();
    setNumber("");
  };

  const handleDelete = (id: string, walletName: string) => {
    Alert.alert(
      "Hapus Rekening",
      `Apakah Anda yakin ingin menghapus ${walletName}?`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: () => {
            const updated = wallets.filter((w) => w.id !== id);
            saveWallets(updated);
          },
        },
      ],
    );
  };

  return (
    <View
      className="flex-1"
      style={{ backgroundColor: "#EEF3F9", paddingTop: insets.top }}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pt-4 pb-2">
        <Text className="text-[26px] font-['Nunito_800ExtraBold'] text-[#0F172A] tracking-tight">
          Dompet
        </Text>
        <Pressable
          onPress={() => setIsModalVisible(true)}
          className="w-10 h-10 rounded-full bg-white items-center justify-center border border-[#E2EAF3]"
        >
          <Feather name="plus" size={20} color="#0369A1" />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: 16,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#0284C7']}
            tintColor="#0284C7"
          />
        }
      >
        {/* Total Assets Card */}
        <View
          className="bg-white p-6 rounded-[24px] mb-8"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.03,
            shadowRadius: 10,
            elevation: 2,
          }}
        >
          <Text className="text-[14px] font-['Nunito_600SemiBold'] text-[#64748B] mb-2">
            Total Aset Bersih
          </Text>
          <View className="flex-row items-baseline mb-5">
            <Text className="text-[20px] font-['Nunito_800ExtraBold'] text-[#0F172A] mr-1">
              Rp
            </Text>
            <Text className="text-[36px] font-['Nunito_800ExtraBold'] text-[#0F172A] tracking-tight">
              25.089.100
            </Text>
          </View>

          {/* Asset Proportion Bar */}
          <View className="mb-2">
            <View className="flex-row justify-between mb-2">
              <Text className="text-[12px] font-['Nunito_700Bold'] text-[#475569]">
                Proporsi Aset
              </Text>
            </View>
            <View className="h-3 rounded-full flex-row overflow-hidden bg-[#F1F5F9]">
              <View className="h-full bg-[#005AAA]" style={{ width: "58%" }} />
              <View className="h-full bg-[#F97316]" style={{ width: "33%" }} />
              <View className="h-full bg-[#00AED6]" style={{ width: "5%" }} />
              <View className="h-full bg-[#10B981]" style={{ width: "4%" }} />
            </View>
          </View>
        </View>

        <Text className="text-[18px] font-['Nunito_800ExtraBold'] text-[#0F172A] mb-4 ml-2">
          Daftar Rekening
        </Text>

        {/* Wallets List */}
        {wallets.map((wallet) => (
          <LinearGradient
            key={wallet.id}
            colors={[wallet.color1, wallet.color2]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 24, // rounded-[24px]
              padding: 20, // p-5
              marginBottom: 16, // mb-4
              position: "relative", // relative
              overflow: "hidden", // overflow-hidden

              // Style shadow bawaan Anda
              shadowColor: wallet.color1,
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.25,
              shadowRadius: 12,
              elevation: 6,
            }}
          >
            {/* Dekorasi Card Pattern */}
            <View className="absolute -right-6 -top-10 w-32 h-32 rounded-full bg-white/10" />
            <View className="absolute -right-10 bottom-0 w-24 h-24 rounded-full bg-white/10" />

            <View className="flex-row justify-between items-center mb-6">
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center mr-3">
                  <MaterialCommunityIcons
                    name={wallet.icon as any}
                    size={20}
                    color="white"
                  />
                </View>
                <View>
                  <Text className="text-[16px] font-['Nunito_800ExtraBold'] text-white">
                    {wallet.name}
                  </Text>
                  <Text className="text-[12px] font-['Nunito_600SemiBold'] text-white/80">
                    {wallet.type}
                  </Text>
                </View>
              </View>
              <Pressable
                onPress={() => handleDelete(wallet.id, wallet.name)}
                hitSlop={10}
              >
                <Feather
                  name="trash-2"
                  size={18}
                  color="rgba(255,255,255,0.8)"
                />
              </Pressable>
            </View>

            <View className="flex-row justify-between items-end">
              <View>
                <Text className="text-[12px] font-['Nunito_600SemiBold'] text-white/70 mb-1">
                  Saldo Tersedia
                </Text>
                <Text className="text-[22px] font-['Nunito_800ExtraBold'] text-white">
                  {wallet.balance}
                </Text>
              </View>
              <Text className="text-[13px] font-['Nunito_700Bold'] text-white/90 tracking-widest">
                {wallet.number}
              </Text>
            </View>
          </LinearGradient>
        ))}
      </ScrollView>

      {/* Modal Tambah Rekening */}
      <Modal visible={isModalVisible} transparent={true} animationType="fade">
        <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />

        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={() => {
            setIsModalVisible(false);
            resetForm();
          }}
        />

        <View className="absolute bottom-0 w-full bg-white rounded-t-[32px] pt-4 pb-8 px-6 shadow-xl">
          <View className="w-12 h-1.5 bg-[#E2EAF3] rounded-full self-center mb-6" />

          <Text className="text-[20px] font-['Nunito_800ExtraBold'] text-[#0F172A] mb-5 text-center">
            Tambah Rekening Baru
          </Text>

          {/* Form Input */}
          <Text className="text-[12px] font-['Nunito_700Bold'] text-[#374151] mb-1.5 ml-1">
            Nama Rekening / Bank
          </Text>
          <View className="bg-[#F9FAFB] rounded-2xl px-4 mb-4 border border-[#E5E7EB] h-[52px] justify-center">
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Contoh: BCA Pribadi, DANA"
              className="flex-1 text-[15px] font-['Nunito_600SemiBold'] text-[#111827]"
            />
          </View>

          <Text className="text-[12px] font-['Nunito_700Bold'] text-[#374151] mb-1.5 ml-1">
            Kategori
          </Text>
          <View className="flex-row gap-2 mb-4">
            {["Bank", "E-Wallet", "Cash"].map((opt) => (
              <Pressable
                key={opt}
                onPress={() => setType(opt)}
                className={`flex-1 items-center justify-center py-3 rounded-2xl border ${type === opt ? "bg-[#EFF6FF] border-[#3B82F6]" : "bg-[#F9FAFB] border-[#E5E7EB]"}`}
              >
                <Text
                  className={`text-[13px] ${type === opt ? "font-['Nunito_800ExtraBold'] text-[#1D4ED8]" : "font-['Nunito_600SemiBold'] text-[#6B7280]"}`}
                >
                  {opt}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text className="text-[12px] font-['Nunito_700Bold'] text-[#374151] mb-1.5 ml-1">
            Saldo Awal
          </Text>
          <View className="bg-[#F9FAFB] rounded-2xl px-4 mb-4 border border-[#E5E7EB] h-[52px] justify-center">
            <TextInput
              value={balanceInput.value}
              onChangeText={balanceInput.onChangeText}
              keyboardType="numeric"
              placeholder="Contoh: Rp 1.500.000"
              className="flex-1 text-[15px] font-['Nunito_600SemiBold'] text-[#111827]"
            />
          </View>

          <Text className="text-[12px] font-['Nunito_700Bold'] text-[#374151] mb-1.5 ml-1">
            Nomor Rekening / HP (Opsional)
          </Text>
          <View className="bg-[#F9FAFB] rounded-2xl px-4 mb-6 border border-[#E5E7EB] h-[52px] justify-center">
            <TextInput
              value={number}
              onChangeText={setNumber}
              keyboardType="number-pad"
              placeholder="Contoh: 1234567890"
              className="flex-1 text-[15px] font-['Nunito_600SemiBold'] text-[#111827]"
            />
          </View>

          {/* Tombol Simpan */}
          <Pressable onPress={handleAddWallet}>
            <LinearGradient
              colors={["#0369A1", "#0284C7"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                borderRadius: 16, // rounded-2xl (1rem = 16px)
                height: 52, // h-[52px]
                alignItems: "center", // items-center
                justifyContent: "center", // justify-center
              }}
            >
              <Text className="text-white text-[16px] font-['Nunito_800ExtraBold'] rounded-xl">
                Simpan Rekening
              </Text>
            </LinearGradient>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}
