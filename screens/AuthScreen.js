// app/AuthScreen.js
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { auth } from './firebase';

export default function AuthScreen({ navigation }) {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigation.navigate('Home');
      } else {
        navigation.navigate('Login');
      }
    });

    return unsubscribe;
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
