import { MotiView } from 'moti';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { useTheme } from '../_context/ThemeContext';
import { useUser } from '../_context/UserContext';

export default function ProfileScreen() {
  const { user } = useUser();
  const { mode, toggleMode } = useTheme();
  const isDark = mode === 'dark';

  const bg = isDark ? '#121212' : '#fff';
  const cardBg = isDark ? '#1E1E1E' : '#f2f2f2';
  const text = isDark ? '#fff' : '#000';
  const subText = isDark ? '#8A8A8A' : '#555';

  return (
    <MotiView
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 300 }}
          style = {{flex: 1}}
    >
      <View style={[styles.container, { backgroundColor: bg }]}>
      <View style={[styles.profileSection, { backgroundColor: bg }]}>
        <View style={[styles.avatar, { backgroundColor: cardBg }]}>
          <Text style={[styles.avatarText, { color: text }]}>{user?.name?.charAt(0) || 'U'}</Text>
        </View>
        <Text style={[styles.name, { color: text }]}>{user?.name || 'Unnamed User'}</Text>
        <Text style={[styles.status, { color: subText }]}>Status: Active</Text>
        <Text style={[styles.email, { color: subText }]}>Email: {user?.email || 'not set'}</Text>
      </View>
      
      <View style={styles.settingsSection}>
        <Text style={[styles.sectionTitle, { color: text }]}>Settings</Text>

        <View style={[styles.settingItem, { backgroundColor: cardBg }]}>
          <Text style={[styles.settingText, { color: text }]}>Dark Mode</Text>

          <Switch
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={isDark ? '#3D8BFD' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleMode}
              value={isDark}
            />
        </View>

        <View style={[styles.settingItem, { backgroundColor: cardBg }]}>
          <Text style={[styles.settingText, { color: text }]}>Logout</Text>
        </View>
      </View>
    </View>

    </MotiView>  
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  profileSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  status: {
    fontSize: 14,
    marginBottom: 8,
  },
  email: {
    fontSize: 14,
  },
  settingsSection: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  settingText: {
    fontSize: 16,
  },
});