import { MaterialIcons } from '@expo/vector-icons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { auth, db } from './firebase';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Email and password are required.');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      const userDocRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists()) {
        const { role } = userSnap.data();

        if (role === 'admin') {
          navigation.replace('AdminDashboard');
        } else if (role === 'student') {
          navigation.replace('Home');
        } else {
          Alert.alert('Access Error', 'User role is not recognized.');
        }
      } else {
        Alert.alert('Login Error', 'No user role found in Firestore.');
      }
    } catch (error) {
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          onChangeText={setPassword}
          value={password}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <MaterialIcons
            name={showPassword ? 'visibility' : 'visibility-off'}
            size={22}
            color="#666"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.loginButton, loading && { opacity: 0.6 }]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.loginButtonText}>Login</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.switchText}>Don’t have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fefefe',
  },
  heading: {
    fontSize: 24,
    marginBottom: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2F318D',
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#aaa',
    marginBottom: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#aaa',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#2F318D',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  switchText: {
    marginTop: 16,
    color: '#2F318D',
    textAlign: 'center',
  },
});
