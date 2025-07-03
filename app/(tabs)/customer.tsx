import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { MotiView } from 'moti';
import { MotiPressable } from 'moti/interactions';
import { useState } from 'react';
import {
  FlatList,
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View
} from 'react-native';
import { useUser } from '../context/UserContext';


if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

const customersList = [
  {
    id: 'ID-0001',
    name: 'Ashleigh R. Sims',
    email: 'ash@example.com',
    phone: '123-456-7890',
    purchases: '$69.42',
    orderCount: 10,
    address: '123 Main St, Cityville',
    expanded: false,
  },
  {
    id: 'ID-0002',
    name: 'Lily M. Pearson',
    email: 'lily@example.com',
    phone: '234-567-8901',
    purchases: '$420.69',
    orderCount: 12,
    address: '456 Elm St, Townsville',
    expanded: false,
  },
  {
    id: 'ID-0003',
    name: 'Walter White',
    email: 'heisenberg@example.com',
    phone: '345-678-9012',
    purchases: '$1',
    orderCount: 99,
    address: '308 Negra Arroyo Lane, Albuquerque, NM',
    expanded: false,
  },
];

export default function CustomerListScreen() {
  const [customers, setCustomers] = useState(customersList);
  const [search, setSearch] = useState('');
  const { user } = useUser();

  const toggleExpand = (id: string) => {
    //animate height/position changes
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setCustomers((prev) =>
      prev.map((cust) =>
        cust.id === id ? { ...cust, expanded: !cust.expanded } : cust
      )
    );
  };

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
          style = {{flex: 1}}
    >
      <View style={styles.container}>
      <Text style={styles.title}>Customer List</Text>

      <View style={styles.searchContainer}>
        <Feather name="search" size={16} color="#aaa" />
        <TextInput
          placeholder="Search customers..."
          placeholderTextColor="#aaa"
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity onPress={() => toggleExpand(item.id)}>
              <Text style={styles.customerName}>{item.name}</Text>
              <Text style={styles.customerId}>{item.id}</Text>
            </TouchableOpacity>
            {item.expanded && (
              <View style={styles.expanded}>
                <Text style={styles.detail}>Email: {item.email}</Text>
                <Text style={styles.detail}>Phone: {item.phone}</Text>
                <Text style={styles.detail}>Purchases: {item.purchases}</Text>
                <Text style={styles.detail}>Orders: {item.orderCount}</Text>
                <Text style={styles.detail}>Address: {item.address}</Text>
                
                <MotiPressable
                  from = {{scale: 1}}
                  animate={({hovered, pressed}) => ({
                    scale: pressed ? 0.95 : hovered ? 1.05 : 1
                  })}
                  transition={{type: 'spring', stiffness: 300, damping: 15}}
                  onPress={() =>
                    router.push({
                      pathname: '/customer/id',
                      params: { id: item.id }
                    })
                  }
                  style = {styles.viewButton}
                >
                  <Feather name = "eye" size = {16} color = "#3D8BFD" />
                  <Text style = {styles.viewButtonText}>View Details</Text>
                </MotiPressable>
              </View>
            )}
          </View>
        )}
      />

      <View style={styles.nav}>
        <TouchableOpacity onPress={() => router.push('/profile')}>
          <Feather name="user" size={22} color="#aaa" />
          <Text style={styles.navLabel}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/dashboard')}>
          <Feather name="home" size={22} color="#aaa" />
          <Text style={styles.navLabel}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/customer')}>
          <Feather name="users" size={22} color="#3D8BFD" />
          <Text style={[styles.navLabel, { color: '#3D8BFD' }]}>Customers</Text>
        </TouchableOpacity>
      </View>
    </View>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 16 },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: '#fff',
  },
  card: {
    backgroundColor: '#1E1E1E',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  customerName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  customerId: {
    color: '#888',
    fontSize: 12,
  },
  expanded: {
    marginTop: 12,
  },
  detail: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 4,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  viewButtonText: {
    color: '#3D8BFD',
    marginLeft: 4,
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#333',
    backgroundColor: '#1E1E1E',
  },
  navLabel: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
});
