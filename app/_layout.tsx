import { Slot, useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './_context/ThemeContext';
import { UserProvider, useUser } from './_context/UserContext';

function RootContent() {
  const { initializing, user } = useUser();
  const router = useRouter();

  // redirect if not logged in
  React.useEffect(() => {
    if (!initializing && !user) router.replace('/login');
  }, [initializing, user]);

  if (initializing) return null;  // or a spinner
  return <Slot />;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <UserProvider>
          <RootContent />
        </UserProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}