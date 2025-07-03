import { Slot } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './_context/ThemeContext';
import { UserProvider } from './_context/UserContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <UserProvider>
          <Slot />
        </UserProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}