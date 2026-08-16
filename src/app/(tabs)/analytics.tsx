import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';
import { PieChart } from 'react-native-gifted-charts';
import { Badge } from '@/components/FinanceUI';

export default function AnalyticsScreen() {
  const pieData = [
    { value: 35, color: '#FF4B4B' },
    { value: 24, color: '#FF7F50' },
    { value: 20, color: '#34C759' },
    { value: 15, color: '#007AFF' },
    { value: 6, color: '#AF52DE' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Analytics</Text>
        <Pressable style={styles.iconButton}>
          <AntDesign name="setting" size={24} color="black" />
        </Pressable>
      </View>

      {/* Segmented Control */}
      <View style={styles.segmentedControl}>
        <Pressable style={[styles.segment, styles.segmentActive]}>
          <Text style={[styles.segmentText, styles.segmentTextActive]}>This month</Text>
        </Pressable>
        <Pressable style={styles.segment}>
          <Text style={styles.segmentText}>Last month</Text>
        </Pressable>
        <Pressable style={styles.segment}>
          <Text style={styles.segmentText}>Custom</Text>
        </Pressable>
      </View>

      {/* Net Income */}
      <View style={styles.netIncomeSection}>
        <Text style={styles.sectionTitle}>Net income</Text>
        <View style={styles.balanceRow}>
          <Text style={styles.currency}>€</Text>
          <Text style={styles.balanceInt}> 3 152</Text>
          <Text style={styles.balanceDec}>.37</Text>
          <Pressable style={styles.addBtn}>
            <AntDesign name="plus" size={16} color="white" />
          </Pressable>
        </View>
        <View style={styles.momContainer}>
          <Badge text="6.3%" color="#ECFDF3" textColor="#027A48" />
          <Text style={styles.momText}>Month-over-Month <AntDesign name="down" size={10} color="#8E8E93" /></Text>
        </View>
      </View>

      {/* Expenses */}
      <View style={styles.expensesSection}>
        <Text style={styles.sectionTitle}>Expenses</Text>
        
        <View style={styles.chartContainer}>
          <PieChart
            data={pieData}
            donut
            innerRadius={80}
            radius={110}
            innerCircleColor={'#fff'}
            centerLabelComponent={() => {
              return (
                <View style={styles.chartCenter}>
                  <Text style={styles.chartCenterAmount}>€ 5 097.21</Text>
                  <Text style={styles.chartCenterLabel}>Total spent</Text>
                </View>
              );
            }}
          />
        </View>

        {/* Legend */}
        <View style={styles.legendList}>
          <LegendItem color="#FF4B4B" name="Mandatory" percentage="35%" amount="€ 1 784.02" />
          <LegendItem color="#FF7F50" name="Food" percentage="24%" amount="€ 1 223.33" />
        </View>
      </View>
      
      {/* Bottom Padding for TabBar */}
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

function LegendItem({ color, name, percentage, amount }: { color: string, name: string, percentage: string, amount: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={styles.legendLeft}>
        <View style={[styles.legendDot, { backgroundColor: color }]} />
        <Text style={styles.legendName}>{name}</Text>
        <View style={styles.legendBadge}>
          <Text style={styles.legendBadgeText}>{percentage}</Text>
        </View>
      </View>
      <Text style={styles.legendAmount}>{amount}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 24,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Nunito_800ExtraBold',
    color: '#000',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#F2F2F7',
    borderRadius: 20,
    padding: 4,
    marginBottom: 40,
  },
  segment: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 16,
  },
  segmentActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  segmentText: {
    fontSize: 13,
    fontFamily: 'Nunito_600SemiBold',
    color: '#8E8E93',
  },
  segmentTextActive: {
    color: '#000',
    fontFamily: 'Nunito_700Bold',
  },
  netIncomeSection: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#8E8E93',
    fontFamily: 'Nunito_600SemiBold',
    marginBottom: 16,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  currency: {
    fontSize: 40,
    fontFamily: 'Nunito_800ExtraBold',
    color: '#000',
  },
  balanceInt: {
    fontSize: 48,
    fontFamily: 'Nunito_800ExtraBold',
    color: '#000',
    letterSpacing: -1,
  },
  balanceDec: {
    fontSize: 40,
    fontFamily: 'Nunito_800ExtraBold',
    color: '#8E8E93',
  },
  addBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    alignSelf: 'center',
  },
  momContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  momText: {
    marginLeft: 8,
    fontSize: 13,
    fontFamily: 'Nunito_600SemiBold',
    color: '#8E8E93',
  },
  expensesSection: {
    backgroundColor: '#fff',
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  chartCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartCenterAmount: {
    fontSize: 20,
    fontFamily: 'Nunito_800ExtraBold',
    color: '#000',
  },
  chartCenterLabel: {
    fontSize: 12,
    fontFamily: 'Nunito_600SemiBold',
    color: '#8E8E93',
  },
  legendList: {
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  legendLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  legendName: {
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
    color: '#000',
    marginRight: 8,
  },
  legendBadge: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  legendBadgeText: {
    fontSize: 10,
    fontFamily: 'Nunito_700Bold',
    color: '#8E8E93',
  },
  legendAmount: {
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
    color: '#000',
  },
});
