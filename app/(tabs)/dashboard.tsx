import { MotiView } from 'moti';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useUser } from '../context/UserContext';

export default function DashboardScreen() {
  const { user } = useUser();

  return (
    <MotiView
      from={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 300 }}
      style = {{flex: 1}}
    >
      <ScrollView style={styles.container}>
      <Text style={styles.pageTitle}>Dashboard</Text>
      <Text style={styles.welcome}>Welcome, {user?.name || 'User'} 👋</Text>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>📦 Orders Today</Text>
        <Text style={styles.cardValue}>14</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>💰 Total Sales</Text>
        <Text style={styles.cardValue}>₱42,000</Text>
      </View>
      </ScrollView>
    </MotiView>
    
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 16 },
  pageTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  welcome: {
    color: '#aaa',
    fontSize: 16,
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#1E1E1E',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  cardLabel: {
    color: '#aaa',
    fontSize: 14,
  },
  cardValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 4,
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#333',
    backgroundColor: '#1E1E1E',
    marginTop: 16,
  },
  navLabel: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
});
