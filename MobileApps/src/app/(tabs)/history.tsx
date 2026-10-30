import { View, Text, ScrollView, Pressable, FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import AnalyticsScreen from "@/components/AnalyticsScreen";

type HistoryTab = "riwayat" | "analisis";

// Dummy Data
const TRANSACTIONS = [
  {
    id: "1",
    title: "Makan Siang (Sate Ayam)",
    category: "Makanan",
    amount: "-Rp 25.000",
    type: "expense",
    date: "Hari Ini, 12:30",
    icon: "fast-food-outline",
    color: "#EA580C",
    bg: "#FFF4ED",
  },
  {
    id: "2",
    title: "Top up DANA",
    category: "Transfer",
    amount: "+Rp 500.000",
    type: "income",
    date: "Hari Ini, 09:15",
    icon: "wallet-outline",
    color: "#059669",
    bg: "#ECFDF3",
  },
  {
    id: "3",
    title: "Netflix Subscription",
    category: "Hiburan",
    amount: "-Rp 153.000",
    type: "expense",
    date: "Kemarin, 19:00",
    icon: "tv-outline",
    color: "#8B5CF6",
    bg: "#F5F3FF",
  },
  {
    id: "4",
    title: "Gojek ke Kantor",
    category: "Transportasi",
    amount: "-Rp 18.000",
    type: "expense",
    date: "Kemarin, 08:00",
    icon: "car-outline",
    color: "#0284C7",
    bg: "#EFF8FF",
  },
  {
    id: "5",
    title: "Gaji Bulanan",
    category: "Pemasukan",
    amount: "+Rp 8.500.000",
    type: "income",
    date: "23 Agustus 2026",
    icon: "cash-outline",
    color: "#059669",
    bg: "#ECFDF3",
  },
  {
    id: "6",
    title: "Beli Kopi",
    category: "Makanan",
    amount: "-Rp 22.000",
    type: "expense",
    date: "23 Agustus 2026",
    icon: "cafe-outline",
    color: "#EA580C",
    bg: "#FFF4ED",
  },
];

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<HistoryTab>("riwayat");
  const [filter, setFilter] = useState<"semua" | "masuk" | "keluar">("semua");

  const filteredData = TRANSACTIONS.filter((t) => {
    if (filter === "semua") return true;
    if (filter === "masuk") return t.type === "income";
    if (filter === "keluar") return t.type === "expense";
    return true;
  });

  const renderTransaction = ({ item }: { item: (typeof TRANSACTIONS)[0] }) => (
    <View
      className="flex-row items-center mb-3 bg-white px-3.5 py-3.5 rounded-2xl border border-[#EEF2F6]"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 1,
      }}
    >
      <View
        className="w-11 h-11 rounded-2xl items-center justify-center mr-3"
        style={{ backgroundColor: item.bg }}
      >
        <Ionicons name={item.icon as any} size={20} color={item.color} />
      </View>

      <View className="flex-1 mr-2">
        <Text
          className="text-[14px] font-['Nunito_800ExtraBold'] text-[#172033] mb-1"
          numberOfLines={1}
        >
          {item.title}
        </Text>
        <View className="flex-row items-center">
          <View
            className="rounded-md px-1.5 py-0.5 mr-1.5"
            style={{ backgroundColor: item.bg }}
          >
            <Text
              className="text-[10px] font-['Nunito_700Bold']"
              style={{ color: item.color }}
              numberOfLines={1}
            >
              {item.category}
            </Text>
          </View>
          <Feather name="clock" size={11} color="#94A3B8" />
          <Text
            className="text-[11px] font-['Nunito_600SemiBold'] text-[#8490A3] ml-1 flex-shrink"
            numberOfLines={1}
          >
            {item.date}
          </Text>
        </View>
      </View>

      <View className="items-end">
        <Text
          className={`text-[13px] font-['Nunito_800ExtraBold'] ${item.type === "income" ? "text-[#059669]" : "text-[#172033]"}`}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.85}
        >
          {item.amount}
        </Text>
      </View>
    </View>
  );

  return (
    <View
      className={`flex-1 ${activeTab === "riwayat" ? "bg-[#F9FAFB]" : "bg-[#EEF3F9]"}`}
      style={{ paddingTop: insets.top }}
    >
      {/* TAB UTAMA HEADER: Riwayat Transaksi vs Analisis Keuangan */}
      <View className="px-5 mt-4 mb-3">
        <View className="flex-row p-1 bg-gray-100 rounded-2xl border border-gray-200">
          {/* Tab 1: Riwayat Transaksi */}
          <Pressable
            onPress={() => setActiveTab("riwayat")}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === "riwayat" }}
            className={`flex-1 py-2.5 rounded-xl items-center justify-center ${
              activeTab === "riwayat" ? "bg-white" : "bg-transparent"
            }`}
            style={
              activeTab === "riwayat"
                ? {
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.05,
                    shadowRadius: 2,
                    elevation: 1,
                  }
                : undefined
            }
          >
            <Text
              className={`text-[13px] font-['Nunito_700Bold'] ${
                activeTab === "riwayat" ? "text-[#0284C7]" : "text-gray-500"
              }`}
            >
              Riwayat
            </Text>
          </Pressable>

          {/* Tab 2: Analisis Keuangan */}
          <Pressable
            onPress={() => setActiveTab("analisis")}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === "analisis" }}
            className={`flex-1 py-2.5 rounded-xl items-center justify-center ${
              activeTab === "analisis" ? "bg-white" : "bg-transparent"
            }`}
            style={
              activeTab === "analisis"
                ? {
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.05,
                    shadowRadius: 2,
                    elevation: 1,
                  }
                : undefined
            }
          >
            <Text
              className={`text-[13px] font-['Nunito_700Bold'] ${
                activeTab === "analisis" ? "text-[#0284C7]" : "text-gray-500"
              }`}
            >
              Analitik
            </Text>
          </Pressable>
        </View>
      </View>

      {activeTab === "riwayat" ? (
        <>
          <View className="px-6 pt-1 pb-2">
            <Text className="text-[24px] font-['Nunito_800ExtraBold'] text-black">
              Riwayat Transaksi
            </Text>
          </View>

          {/* Filter Tabs */}
          <View className="mt-4 mb-3">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 24, gap: 10 }}
            >
              <Pressable
                onPress={() => setFilter("semua")}
                className={`px-5 py-2.5 rounded-full border ${filter === "semua" ? "bg-[#0284C7] border-[#0284C7]" : "bg-white border-[#E5E7EB]"}`}
              >
                <Text
                  className={`text-[13px] font-['Nunito_700Bold'] ${filter === "semua" ? "text-white" : "text-[#6B7280]"}`}
                >
                  Semua
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setFilter("masuk")}
                className={`px-5 py-2.5 rounded-full border ${filter === "masuk" ? "bg-[#10B981] border-[#10B981]" : "bg-white border-[#E5E7EB]"}`}
              >
                <Text
                  className={`text-[13px] font-['Nunito_700Bold'] ${filter === "masuk" ? "text-white" : "text-[#6B7280]"}`}
                >
                  Uang Masuk
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setFilter("keluar")}
                className={`px-5 py-2.5 rounded-full border ${filter === "keluar" ? "bg-[#EA580C] border-[#EA580C]" : "bg-white border-[#E5E7EB]"}`}
              >
                <Text
                  className={`text-[13px] font-['Nunito_700Bold'] ${filter === "keluar" ? "text-white" : "text-[#6B7280]"}`}
                >
                  Uang Keluar
                </Text>
              </Pressable>
            </ScrollView>
          </View>

          {/* Transaction List */}
          <FlatList
            data={filteredData}
            keyExtractor={(item) => item.id}
            renderItem={renderTransaction}
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingTop: 16,
              paddingBottom: 10,
            }}
            showsVerticalScrollIndicator={false}
          />
        </>
      ) : (
        <AnalyticsScreen embedded />
      )}
    </View>
  );
}
