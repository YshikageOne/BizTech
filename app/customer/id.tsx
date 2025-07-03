import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../_config/firebase';
import { useTheme } from '../_context/ThemeContext';
import { ordersData } from './orders-data';

const { width } = Dimensions.get('window');

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalPurchases: string;
  orderCount: number;
  address: string;
}

export default function CustomerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const { colors } = useTheme();

  useEffect(() =>{
    if (!id) return;

    const unsubscribe = onSnapshot(doc(db, 'customers', id), snap => {
      if (snap.exists()){
        const data = snap.data() as any;
        setCustomer({
          id: snap.id,
          ...data
        });
      }else{
        setCustomer(null);
      }
      setLoading(false);
    });
    return unsubscribe;
    }, [id]);
  
  if (loading){
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges = {['top']}>
        <View style = {{flex: 1, justifyContent: 'center', alignContent: 'center'}}>
          <ActivityIndicator size = "large" color={colors.accent}/>
        </View>
      </SafeAreaView>
    );
  }

  if (!customer) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges = {['top']}>
        <Text style = {[styles.notFound, { color: colors.text }]}>Customer not found</Text>
      </SafeAreaView>
    );
  }

  const rawOrders = ordersData[customer.id] || [];
  const computedTotal = rawOrders.reduce((sum, o) => sum + o.amount, 0).toFixed(2);
  const computedCount = rawOrders.length;
  const sorted = [...rawOrders].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const labels = sorted.map(o =>
    new Date(o.date).toLocaleDateString('en-US', { month: 'short'})
  );

  const amount = sorted.map(o => o.amount);

  const maxTicks = 6;
  const step = Math.ceil(labels.length / maxTicks);
  const filteredLabels = labels.filter((_, i) => i % step === 0);
  const filteredAmounts = sorted
    .filter((_,i) => i % step === 0)
    .map(o => o.amount);

  return (
    <SafeAreaView style = {[styles.container, { backgroundColor: colors.background }]} edges = {['top']}>
      <TouchableOpacity
        onPress={() => router.push({ pathname: '/customer' })}
        style = {styles.backButton}
      >
        <Feather name="arrow-left" size={24} color={colors.text} />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ paddingTop: 8 }}>
        <Text style={[styles.name, { color: colors.text }]}>{customer.name}</Text>
        <Text style={[styles.label, { color: colors.subText }]}>
          Email: <Text style={[styles.value, { color: colors.text }]}>{customer.email}</Text>
        </Text>
        <Text style={[styles.label, { color: colors.subText }]}>
          Phone: <Text style={[styles.value, { color: colors.text }]}>{customer.phone}</Text>
        </Text>
        <Text style={[styles.label, { color: colors.subText }]}>
          Total Purchases: {' '}
          <Text style = {[styles.value, { color: colors.text }]}>
            ${computedTotal}
            </Text>
        </Text>
        <Text style={[styles.label, { color: colors.subText }]}>
          Orders: <Text style={[styles.value, { color: colors.text }]}>{customer.orderCount}</Text>
        </Text>
        <Text style={[styles.label, { color: colors.subText }]}>
          Address: <Text style={[styles.value, { color: colors.text }]}>{customer.address}</Text>
        </Text>

        <Text style={[styles.chartTitle, {color: colors.text}]}>Purchases Over Time</Text>
        <View style = {[styles.chartContainer, {backgroundColor: colors.text}]}>
          <LineChart
          data={{
            labels: filteredLabels,
            datasets: [{ data: filteredAmounts, strokeWidth: 2 }],
          }}
          width={width - 32}
          height={220}
          chartConfig={{
            backgroundColor: colors.background,
            backgroundGradientFrom: colors.background,
            backgroundGradientTo: colors.card,
            decimalPlaces: 0,
            color: () => colors.accent,
            labelColor: () => colors.subText,
          }}
        />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    padding: 12
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginHorizontal: 16,
    marginTop: 8,
  },
  value: {
    fontWeight: 'bold',
  },
  chartContainer: {  
    marginHorizontal: 16,
    borderRadius: 8,
  },
  chartTitle: {
    fontSize: 18,
    marginTop: 24,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  chart: {
    marginHorizontal: 16,
    borderRadius: 8,
  },
  notFound: {
    padding: 16,
  },
});
