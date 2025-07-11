import { collection, onSnapshot } from 'firebase/firestore';
import { MotiView } from 'moti';
import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { db } from '../_config/firebase';
import { useTheme } from '../_context/ThemeContext';
import { useUser } from '../_context/UserContext';

export default function DashboardScreen() {
  const { user, profile } = useUser(); 
  const { colors } = useTheme();

  const [totalOrders, setTotalOrders] = useState(0);
  const [totalSales, setTotalSales] = useState(0);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'customers'), (snapshot) => {
      let orders = 0;
      let sales = 0;

      snapshot.docs.forEach(doc => {
        const data = doc.data() as any;
        orders += data.orderCount || 0;
        sales += parseFloat(data.totalPurchases ?? '0') || 0;
      });
      setTotalOrders(orders);
      setTotalSales(sales);
    });
    return () => unsubscribe();
  }, []);

  const displayName = profile?.name || user?.email?.split('@')[0] || 'User';

  return (
    <MotiView
      from={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 300 }}
      style = {{flex: 1}}
    >
      <ScrollView style={{ flex: 1, backgroundColor: colors.background, padding: 16 }}>
      <Text style={{ color: colors.text, fontSize: 22, fontWeight: 'bold', marginBottom: 8 }}>
        Dashboard
        </Text>
        
      <Text style={{ color: colors.subText, fontSize: 16, marginBottom: 16 }}>
          Welcome, {displayName} 👋
        </Text>

      <View style={{
          backgroundColor: colors.card,
          padding: 16,
          borderRadius: 12,
          marginBottom: 12
        }}>
          <Text style={{ color: colors.subText, fontSize: 14 }}>📦 Orders Today</Text>
          <Text style={{ color: colors.text, fontSize: 20, fontWeight: 'bold', marginTop: 4 }}>
            {totalOrders}
          </Text>
        </View>

      <View style={{
          backgroundColor: colors.card,
          padding: 16,
          borderRadius: 12,
          marginBottom: 12
        }}>
          <Text style={{ color: colors.subText, fontSize: 14 }}>💰 Total Sales</Text>
          <Text style={{ color: colors.text, fontSize: 20, fontWeight: 'bold', marginTop: 4 }}>
            ${totalSales.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </Text>
        </View>
      </ScrollView>
    </MotiView>
    
  );
}
