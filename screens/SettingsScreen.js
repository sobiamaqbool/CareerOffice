import { CommonActions, useNavigation } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth } from './firebase';

export default function SettingsScreen() {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'LoginScreen' }],
        })
      );
    } catch (error) {
      Alert.alert('Logout Failed', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('ChangePasswordScreen')}>
        <Text style={styles.buttonText}>Change Password</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('NotificationPreferencesScreen')}>
        <Text style={styles.buttonText}>Notification Preferences</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('PrivacyPolicyScreen')}>
        <Text style={styles.buttonText}>Privacy Policy</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#2F318D',
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#d9534f',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
});
