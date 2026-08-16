import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { AntDesign, Feather } from '@expo/vector-icons';
import { TransactionItem, Badge } from '@/components/FinanceUI';

export default function CapitalScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.iconButton}>
          <Feather name="chevron-left" size={24} color="black" />
        </Pressable>
        <Text style={styles.headerTitle}>My capital</Text>
        <Pressable style={styles.iconButton}>
          <Feather name="bar-chart-2" size={20} color="black" />
        </Pressable>
      </View>

      {/* Main Balance */}
      <View style={styles.balanceSection}>
        <View style={styles.balanceRow}>
          <Text style={styles.currency}>€</Text>
          <Text style={styles.balanceInt}> 58 274</Text>
          <Text style={styles.balanceDec}>.38</Text>
          <Pressable style={styles.addBtn}>
            <AntDesign name="plus" size={16} color="white" />
          </Pressable>
        </View>
        <View style={styles.momContainer}>
          <Badge text="6.3%" color="#ECFDF3" textColor="#027A48" />
          <Text style={styles.momText}>Month-over-Month <AntDesign name="down" size={10} color="#8E8E93" /></Text>
        </View>
      </View>

      {/* Sources */}
      <View style={styles.sourcesSection}>
        <Text style={styles.sectionTitle}>Sources</Text>
        
        {/* Horizontal Bar */}
        <View style={styles.barContainer}>
          <View style={[styles.barSegment, { backgroundColor: '#FF4B4B', flex: 10 }]} />
          <View style={[styles.barSegment, { backgroundColor: '#FF7F50', flex: 13 }]} />
          <View style={[styles.barSegment, { backgroundColor: '#34C759', flex: 18 }]} />
          <View style={[styles.barSegment, { backgroundColor: '#007AFF', flex: 25 }]} />
          <View style={[styles.barSegment, { backgroundColor: '#AF52DE', flex: 34 }]} />
        </View>

        {/* Legend */}
        <View style={styles.legendList}>
          <LegendItem color="#FF4B4B" name="N26" percentage="10%" amount="€ 5 827.44" />
          <LegendItem color="#FF7F50" name="Commerce Bank" percentage="13%" amount="€ 7 575.67" />
          <LegendItem color="#34C759" name="Cash" percentage="18%" amount="€ 10 489.39" />
          <LegendItem color="#007AFF" name="Savings" percentage="25%" amount="€ 14 568.60" />
          <LegendItem color="#AF52DE" name="Invests" percentage="34%" amount="€ 19 813.29" />
        </View>
      </View>

      {/* Incomes */}
      <View style={styles.incomesSection}>
        <Text style={styles.sectionTitle}>Recent incomes</Text>
        <TransactionItem 
          title="Monthly deposit"
          subtitle="15 Jun at 8:00 am"
          badgeText="Cash"
          badgeColor="yellow"
          amount="€ 1 500"
        />
        <TransactionItem 
          title="Monthly saving"
          subtitle="26 Jun at 1:30 pm"
          badgeText="Savings"
          badgeColor="blue"
          amount="€ 1 000"
        />
        <TransactionItem 
          title="Monthly invests"
          subtitle="26 Jun at 6:30 pm"
          badgeText="Invests"
          badgeColor="purple"
          amount="€ 5 000"
        />
      </View>
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
    marginBottom: 40,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
    color: '#000',
  },
  balanceSection: {
    marginBottom: 40,
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
  sourcesSection: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#8E8E93',
    fontFamily: 'Nunito_600SemiBold',
    marginBottom: 16,
  },
  barContainer: {
    flexDirection: 'row',
    height: 24,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
    gap: 2,
  },
  barSegment: {
    height: '100%',
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
  incomesSection: {
    marginTop: 10,
  },
});
