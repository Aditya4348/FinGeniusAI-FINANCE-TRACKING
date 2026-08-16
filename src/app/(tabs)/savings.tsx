import { View, Text, StyleSheet } from 'react-native';

export default function SavingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Savings</Text>
      <Text style={styles.subtitle}>Coming soon...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Nunito_800ExtraBold',
    color: '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
    color: '#8E8E93',
  }
});
