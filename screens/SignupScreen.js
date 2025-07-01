import { Ionicons } from '@expo/vector-icons'; // Make sure expo/vector-icons is installed
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { auth, db } from './firebase';

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Email and password are required.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        role: 'student',
      });

      Alert.alert('Success', 'Account created successfully!');
      navigation.replace('Home');
    } catch (error) {
      Alert.alert('Signup Failed', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Sign Up</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          onChangeText={setPassword}
          value={password}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? 'eye-off' : 'eye'}
            size={24}
            color="#555"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
        <Text style={styles.signupButtonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.switchText}>Already have an account? Log in</Text>
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
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 18
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#aaa',
    paddingVertical: 8,
    marginBottom: 16,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: 18,
  },
  signupButton: {
    backgroundColor: '#2F318D',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  signupButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  switchText: {
    marginTop: 16,
    color: '#007bff',
    textAlign: 'center',
  },
});
