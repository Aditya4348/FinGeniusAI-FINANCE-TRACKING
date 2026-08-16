import { View, Text, StyleSheet, ScrollView, Image, Pressable } from 'react-native';
import { GradientCard, CapitalCard, TransactionItem } from '@/components/FinanceUI';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function OverviewScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: 'https://i.pravatar.cc/150?img=11' }} 
              style={styles.avatar} 
            />
          </View>
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.nameText}>Caspar</Text>
          </View>
        </View>
        <Pressable style={styles.iconButton}>
          <Feather name="lock" size={20} color="black" />
        </Pressable>
      </View>

      {/* Cards */}
      <View style={styles.cardsSection}>
        <GradientCard balance="€ 5 827.44" title="N26 balance" />
        
        {/* Pager Dots */}
        <View style={styles.pagerDots}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

        <Pressable onPress={() => router.push('/capital')}>
          <CapitalCard balance="€ 58 274.38" mom="6.3%" />
        </Pressable>
      </View>

      {/* Transactions */}
      <View style={styles.transactionsSection}>
        <Text style={styles.sectionTitle}>Recent transactions</Text>
        
        <TransactionItem 
          title="Interactive Brokers"
          subtitle="Today at 1:30 pm"
          badgeText="N26"
          badgeColor="red"
          amount="-€ 500"
        />
        <TransactionItem 
          title="Apple"
          subtitle="27 Jun at 10:30 am"
          badgeText="N26"
          badgeColor="red"
          amount="-€ .99"
        />
        <TransactionItem 
          title="Aaron Hoffmann"
          subtitle="26 Jun at 8:30 pm"
          badgeText="Commerce Bank"
          badgeColor="green"
          amount="-€ .99"
        />
        <TransactionItem 
          title="Products"
          subtitle="26 Jun at 6:30 pm"
          badgeText="Cash"
          badgeColor="yellow"
          amount="-€ 7.99"
        />
      </View>
      
      {/* Bottom Padding for TabBar */}
      <View style={{ height: 100 }} />
    </ScrollView>
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
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F2F2F7',
    marginRight: 12,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  welcomeText: {
    fontSize: 13,
    color: '#8E8E93',
    fontFamily: 'Nunito_600SemiBold',
  },
  nameText: {
    fontSize: 18,
    color: '#000',
    fontFamily: 'Nunito_700Bold',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardsSection: {
    marginBottom: 24,
  },
  pagerDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E5E5EA',
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: '#000',
  },
  transactionsSection: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#8E8E93',
    fontFamily: 'Nunito_600SemiBold',
    marginBottom: 16,
  },
});