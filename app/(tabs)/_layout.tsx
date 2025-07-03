import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { MotiView } from 'moti';
import { LogBox } from 'react-native';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../_context/ThemeContext';
import { UserProvider } from '../_context/UserContext';

//this error has been killing me...:(
LogBox.ignoreLogs([
  'Invalid prop `style` supplied to `React.Fragment`'
]);

export default function Layout() {
  return (
    <SafeAreaProvider>
      <UserProvider>            
        <ThemedStatusBar />
        <LayoutContent />
      </UserProvider>
    </SafeAreaProvider>
  );
}

function ThemedStatusBar(){
  const {mode} = useTheme();
  return <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
}

function LayoutContent() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
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
              height: 56 + insets.bottom,
              paddingBottom: insets.bottom,
              backgroundColor: colors.navBg,
              borderTopColor: colors.border,
              borderTopWidth: 1,
            },
            tabBarActiveTintColor: colors.accent,
            tabBarInactiveTintColor: colors.navInactive,
          }}
        >
          <Tabs.Screen
            name="dashboard"
            options={{
              title: 'Dashboard',
              tabBarIcon: ({ color, size }) => (
                <Feather name="home" size={size} color={color} />
              ),
            }}
          />

          <Tabs.Screen
            name="customer"
            options={{
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
        </Tabs>
      </MotiView>
    </SafeAreaView>
  );
}