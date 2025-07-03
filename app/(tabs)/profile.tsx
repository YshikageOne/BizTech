import { MotiView } from 'moti';
import { ActivityIndicator, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../_context/ThemeContext';
import { useUser } from '../_context/UserContext';

export default function ProfileScreen() {
  const { profile, initializing, signOutUser, user } = useUser();
  const { mode, toggleMode, colors } = useTheme();
  const isDark = mode === 'dark';

  if (initializing) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (!profile && !user) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: colors.subText }}>No profile found.</Text>
      </View>
    );
  }

  // Debug logs
  console.log('=== Profile Screen Debug ===');
  console.log('initializing:', initializing);
  console.log('profile:', profile);
  console.log('user:', user);
  console.log('user email:', user?.email);
  
  if (!profile && !user) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: colors.subText }}>No profile found.</Text>
      </View>
    );
  }

  const name = profile?.name || user?.email?.split('@')[0] || 'User';
  const status = profile?.status || 'Active';
  
  console.log('profile.name:', profile?.name);
  console.log('final displayName:', name);
  console.log('final status:', status);


  const avatarLetter = name.charAt(0).toUpperCase();

  return (
    <MotiView 
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 300 }}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.profileSection}>
        <View style={[styles.avatar, { backgroundColor: colors.subText }]}>
          <Text style={[styles.avatarText, { color: colors.background }]}>{avatarLetter}</Text>
        </View>
        
        <Text style={[styles.name, { color: colors.text }]}>{name}</Text>
        
        <Text style={[styles.status, { color: colors.subText }]}>Status: {status}</Text>
        
        {user?.email && (
          <Text style={[styles.email, { color: colors.subText }]}>Email: {user.email}</Text>
        )}
      </View>

      <View style={styles.settingsSection}>
        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.text }]}>Dark Mode</Text>
          <Switch
            value={isDark}
            onValueChange={toggleMode}
            trackColor={{ true: colors.accent, false: colors.border }}
            thumbColor={isDark ? colors.background : colors.accent}
          />
        </View>

        <TouchableOpacity 
          onPress={signOutUser} 
          style={[styles.signOut, { borderColor: colors.border }]}
        >
          <Text style={{ color: colors.accent, fontSize: 16, fontWeight: '600' }}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16 
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40
  },
  avatar: { 
    width: 80, 
    height: 80, 
    borderRadius: 40, 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold'
  },
  name: { 
    fontSize: 24, 
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center'
  },
  status: { 
    fontSize: 14, 
    marginBottom: 4,
    textAlign: 'center'
  },
  email: { 
    fontSize: 14,
    textAlign: 'center'
  },
  settingsSection: {
    marginTop: 20
  },
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginVertical: 12 
  },
  label: { 
    fontSize: 16 
  },
  signOut: { 
    marginTop: 32, 
    padding: 12, 
    borderWidth: 1, 
    borderRadius: 6, 
    alignItems: 'center' 
  }
});