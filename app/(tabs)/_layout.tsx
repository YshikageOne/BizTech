import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { UserProvider } from '../context/UserContext';

import { AnimatePresence, MotiView } from 'moti';

export default function Layout() {
  return (
    <SafeAreaProvider>
      <UserProvider>
        <StatusBar style="light" />
        <SafeAreaView style={{ flex: 1, backgroundColor: '#121212' }} edges={['top', 'bottom']}>
          <AnimatePresence exitBeforeEnter>
            <MotiView
              key="root-tabs"
              from={{ opacity: 0, translateY: 10 }}
              animate={{ opacity: 1, translateY: 0 }}
              exit={{ opacity: 0, translateY: -10 }}
              transition={{ type: 'timing', duration: 300 }}
              style={{ flex: 1 }}
            >
              <Tabs
                screenOptions={{
                  headerShown: false,
                  tabBarStyle: {
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: '#1E1E1E',
                    borderTopColor: '#333',
                    borderTopWidth: 1,
                  },
                  tabBarActiveTintColor: '#3D8BFD',
                  tabBarInactiveTintColor: '#8A8A8A',
                }}
              >
                <Tabs.Screen
                  name = "dashboard"
                  options = {{
                    title: 'Dashboard',
                    tabBarIcon: ({ color, size }) => (
                        <Feather name="home" size={size} color={color} />
                    ),
                  }}  
                />

                <Tabs.Screen
                  name = "customers"
                  options = {{
                    title: 'Customers',
                    tabBarIcon: ({ color, size }) => (
                       <Feather name="users" size={size} color={color} />
                    ),
                  }}
                />

                <Tabs.Screen
                  name="profile"
                  options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, size }) => (
                      <Feather name="user" size={size} color={color} />
                    ),
                  }}
                />

                <Tabs.Screen
                  name="settings"
                  options={{
                    title: 'Settings',
                    tabBarIcon: ({ color, size }) => (
                      <Feather name="settings" size={size} color={color} />
                    ),
                  }}
                />
              </Tabs>
            </MotiView>
          </AnimatePresence>
        </SafeAreaView>
      </UserProvider>
    </SafeAreaProvider>
  );
}