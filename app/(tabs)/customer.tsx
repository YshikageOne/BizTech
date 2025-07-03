import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { collection, doc, documentId, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';
import { MotiView } from 'moti';
import { MotiPressable } from 'moti/interactions';
import { useEffect, useState } from 'react';
import {
  FlatList,
  LayoutAnimation,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { db } from '../_config/firebase';
import { useTheme } from '../_context/ThemeContext';
import { useUser } from '../_context/UserContext';
import { ordersData } from '../customer/orders-data';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalPurchases: string;
  orderCount: number;
  address: string;
  expanded?: boolean;
}

export default function CustomerListScreen() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "id">("name");

  const { user } = useUser();
  const { colors } = useTheme();

  const updateCustomerTotals = async (customerId: string) => {
    const customerOrders = ordersData[customerId] || [];
    const totalPurchases = customerOrders.reduce((sum, order) => sum + order.amount, 0);
    const orderCount = customerOrders.length;

    try {
      const customerDoc = doc(db, 'customers', customerId);
      await updateDoc(customerDoc, {
        totalPurchases: totalPurchases.toFixed(2),
        orderCount: orderCount
      });
    } catch (error) {
      if (error.code !== 'not-found') {
        console.error('Error updating customer totals:', error);
      }
    }
  };

  const syncExistingCustomers = async (existingCustomerIds: string[]) => {
    for (const customerId of existingCustomerIds) {
      if (ordersData[customerId]) {
        await updateCustomerTotals(customerId);
      }
    }
  };

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setCustomers(prev =>
      prev.map(c => (c.id === id ? { ...c, expanded: !c.expanded } : c))
    );
  };

  useEffect(() => {
    const q = sortBy === "name"
      ? query(collection(db, "customers"), orderBy("name"))
      : query(collection(db, "customers"), orderBy(documentId()));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => {
        const data = doc.data() as any;
        const customerOrders = ordersData[doc.id] || [];
        const computedTotal = customerOrders.reduce((sum, order) => sum + order.amount, 0);
        const computedCount = customerOrders.length;

        return {
          id: doc.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          totalPurchases: computedTotal.toFixed(2),
          orderCount: computedCount,
          expanded: false,
        };
      });
      setCustomers(list);
      
      const existingCustomerIds = list.map(customer => customer.id);
      syncExistingCustomers(existingCustomerIds);
    });
    return unsubscribe;
  }, [sortBy]);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <MotiView
      from={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 300 }}
      style={{ flex: 1 }}
    >
       <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>Customer List</Text>

       <View style={styles.sortContainer}>
          <Text style={{ color: colors.text, marginRight: 8 }}>Sort by:</Text>
          {(["name","id"] as const).map(key => (
            <TouchableOpacity
              key={key}
              onPress={() => setSortBy(key)}
              style={[
                styles.sortButton,
                sortBy === key && { backgroundColor: colors.accent }
              ]}
            >
              <Text style={{
                color: sortBy === key ? colors.card : colors.text,
                fontWeight: sortBy === key ? "bold" : "normal"
              }}>
                {key === "name" ? "Name" : "ID"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
          <Feather name="search" size={16} color={colors.subText} />
          <TextInput
            placeholder="Search customers..."
            placeholderTextColor={colors.subText}
            style={[styles.searchInput, { color: colors.text }]}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <FlatList
          data={customers.filter(
            c => c.name.toLowerCase().includes(search.toLowerCase()) 
            || c.id.toLowerCase().includes(search.toLowerCase())
          )}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={[styles.card, {backgroundColor: colors.card}]}>
              <TouchableOpacity onPress={() => toggleExpand(item.id)}>
                <Text style={[styles.customerName, {color: colors.text}]}>{item.name}</Text>
                <Text style={[styles.customerId, {color: colors.subText}]}>{item.id}</Text>
              </TouchableOpacity>
              {item.expanded && (
                <View style={styles.expanded}>
                  <Text style={[styles.detail, {color: colors.subText}]}>Email: {item.email}</Text>
                  <Text style={[styles.detail, {color: colors.subText}]}>Phone: {item.phone}</Text>
                  <Text style={[styles.detail, {color: colors.subText}]}>Total Purchases: ${item.totalPurchases}</Text>
                  <Text style={[styles.detail, {color: colors.subText}]}>Orders: {item.orderCount}</Text>
                  <Text style={[styles.detail, {color: colors.subText}]}>Address: {item.address}</Text>
                  
                  <MotiPressable
                    from={{ scale: 1 }}
                    animate={({ hovered, pressed }) => ({
                      scale: pressed ? 0.95 : hovered ? 1.05 : 1
                    })}
                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                    onPress={() =>
                      router.push({
                        pathname: '/customer/id',
                        params: { id: item.id }
                      })
                    }
                    style={styles.viewButton}
                  >
                    <Feather name="eye" size={16}  color={colors.accent} />
                    <Text style={[styles.viewButtonText, {color: colors.accent}]}>View Details</Text>
                  </MotiPressable>
                </View>
              )}
            </View>
          )}
        />

        <View style={[styles.nav, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
          <TouchableOpacity onPress={() => router.push('/profile')}>
            <Feather name="user" size={22} color={colors.subText} />
            <Text style={[styles.navLabel, {color:colors.subText}]}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/dashboard')}>
            <Feather name="home" size={22} color={colors.subText} />
            <Text style={[styles.navLabel, {color:colors.subText}]}>Dashboard</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/customer')}>
            <Feather name="users" size={22} color={colors.accent} />
            <Text style={[styles.navLabel, { color: colors.accent }]}>Customers</Text>
          </TouchableOpacity>
        </View>
      </View>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
  },
  card: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  customerName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  customerId: {
    fontSize: 12,
  },
  expanded: {
    marginTop: 12,
  },
  detail: {
    fontSize: 14,
    marginBottom: 4,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  viewButtonText: {
    marginLeft: 4,
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
  },
  navLabel: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  sortContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 8,
  },
});