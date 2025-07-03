import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { useTheme } from './_context/ThemeContext';
import { useUser } from './_context/UserContext';

export default function LoginScreen() {
  const { colors }      = useTheme();
  const { user, initializing, signIn } = useUser();
  const router          = useRouter();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');

  //if already authenticated, go to dashboard
  useEffect(() => {
    if (!initializing && user) {
      router.replace('/dashboard');
    }
  }, [user, initializing]);

  const handleLogin = async () => {
    try {
      await signIn(email.trim(), password);
      //onAuthStateChanged in RootLayoutContent will redirect
    } catch (e: any) {
      Alert.alert('Login failed', e.message);
    }
  };

  if (initializing) return null;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Login</Text>
      <TextInput
        style={[styles.input, { borderColor: colors.border, color: colors.text }]}
        placeholder="Email"
        placeholderTextColor={colors.subText}
        autoCapitalize="none"
        keyboardType="email-address"
        onChangeText={setEmail}
      />
      <TextInput
        style={[styles.input, { borderColor: colors.border, color: colors.text }]}
        placeholder="Password"
        placeholderTextColor={colors.subText}
        secureTextEntry
        onChangeText={setPassword}
      />
      <Button title="Sign In" onPress={handleLogin} color={colors.accent} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  title:     { fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  input:     { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 12 },
});