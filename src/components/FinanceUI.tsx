import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons';

// Types
export interface TransactionItemProps {
  iconUrl?: string;
  title: string;
  subtitle: string;
  badgeText?: string;
  badgeColor?: string;
  amount: string;
}

export function Badge({ text, color = '#F2F2F7', textColor = '#000' }: { text: string, color?: string, textColor?: string }) {
  return (
    <View style={[styles.badge, { backgroundColor: color }]}>
      <Text style={[styles.badgeText, { color: textColor }]}>{text}</Text>
    </View>
  );
}

export function GradientCard({ balance, title }: { balance: string, title?: string }) {
  return (
    <LinearGradient
      colors={['#FF4B4B', '#FF7F50']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientCard}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{title || 'N26 balance'}</Text>
        <AntDesign name="ellipsis1" size={24} color="white" />
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardBalance}>{balance}</Text>
        <Pressable style={styles.addMoneyBtn}>
          <AntDesign name="plus" size={14} color="white" />
          <Text style={styles.addMoneyText}>Add money</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

export function CapitalCard({ balance, mom }: { balance: string, mom: string }) {
  return (
    <View style={styles.capitalCard}>
      <View style={styles.capitalIcon}>
        <View style={styles.capitalInnerIcon}></View>
      </View>
      <View style={styles.capitalInfo}>
        <Text style={styles.capitalTitle}>Total capital</Text>
        <Text style={styles.capitalBalance}>{balance}</Text>
      </View>
      <View style={styles.momBadge}>
        <Text style={styles.momTitle}>MoM</Text>
        <Text style={styles.momValue}>{mom}</Text>
      </View>
    </View>
  );
}

export function TransactionItem({ title, subtitle, badgeText, badgeColor, amount }: TransactionItemProps) {
  // Parsing badge color logic for demonstration
  let bColor = '#FDEBEB'; // light red
  let tColor = '#D92D20'; // red
  if (badgeColor === 'green') {
    bColor = '#ECFDF3';
    tColor = '#027A48';
  } else if (badgeColor === 'yellow') {
    bColor = '#FFFAEB';
    tColor = '#B54708';
  } else if (badgeColor === 'blue') {
    bColor = '#EFF8FF';
    tColor = '#175CD3';
  } else if (badgeColor === 'purple') {
    bColor = '#F4F3FF';
    tColor = '#5925DC';
  }

  return (
    <View style={styles.transactionItem}>
      <View style={styles.txIconPlaceholder}>
        <Text style={styles.txIconText}>{title.substring(0, 1)}</Text>
      </View>
      <View style={styles.txDetails}>
        <View style={styles.txTitleRow}>
          <Text style={styles.txTitle}>{title}</Text>
          {badgeText && <Badge text={badgeText} color={bColor} textColor={tColor} />}
        </View>
        <Text style={styles.txSubtitle}>{subtitle}</Text>
      </View>
      <Text style={styles.txAmount}>{amount}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 6,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  badgeText: {
    fontSize: 10,
    fontFamily: 'Nunito_700Bold',
  },
  gradientCard: {
    borderRadius: 24,
    padding: 24,
    height: 180,
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
  },
  cardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardBalance: {
    color: 'white',
    fontSize: 32,
    fontFamily: 'Nunito_800ExtraBold',
  },
  addMoneyBtn: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addMoneyText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    marginLeft: 6,
  },
  capitalCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  capitalIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  capitalInnerIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  capitalInfo: {
    flex: 1,
  },
  capitalTitle: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    fontFamily: 'Nunito_600SemiBold',
  },
  capitalBalance: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
  },
  momBadge: {
    alignItems: 'flex-end',
  },
  momTitle: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    fontFamily: 'Nunito_600SemiBold',
  },
  momValue: {
    color: '#34C759',
    fontSize: 15,
    fontFamily: 'Nunito_700Bold',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
  },
  txIconPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  txIconText: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    color: '#8E8E93',
  },
  txDetails: {
    flex: 1,
  },
  txTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  txTitle: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
    color: '#000',
  },
  txSubtitle: {
    fontSize: 13,
    fontFamily: 'Nunito_600SemiBold',
    color: '#8E8E93',
  },
  txAmount: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
    color: '#000',
  }
});
