import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { auth } from './app/firebase';

// 🔔 Notification setup
import { registerForPushNotificationsAsync } from './notifications';

// Screens
import AdminDashboardScreen from './app/admindashboardscreen';
import AppointmentsScreen from './app/AppointmentsScreen';
import AuthScreen from './app/AuthScreen';
import BookAppointmentScreen from './app/BookAppointmentScreen';
import ChatScreen from './app/ChatScreen';
import EventsScreen from './app/EventsScreen';
import ExpertsScreen from './app/ExpertsScreen';
import HomeScreen from './app/index';
import JobsScreen from './app/JobsScreen';
import LoginScreen from './app/LoginScreen';
import NotificationsScreen from './app/NotificationsScreen';
import ProfileScreen from './app/ProfileScreen';
import SettingsScreen from './app/SettingsScreen';
import SignupScreen from './app/SignupScreen';

// Admin-specific Screens
import AdminAppointmentsScreen from './app/AdminAppointmentsScreen';
import ManageEventsScreen from './app/ManageEventsScreen';
import ManageExpertsScreen from './app/ManageExpertsScreen';
import ManageJobsScreen from './app/ManageJobsScreen';

// ✅ Updated filenames for Settings-related Screens
import ChangePasswordScreen from './app/changepassword';
import NotificationPreferencesScreen from './app/NotificationPref';
import PrivacyPolicyScreen from './app/PrivacyPolicy';

const Stack = createNativeStackNavigator();

export default function App() {
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => {
      setAuthReady(true);
    });

    // 🔔 Register for notifications
    registerForPushNotificationsAsync();

    return () => unsubscribe();
  }, []);

  if (!authReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading Firebase Auth...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Auth" screenOptions={{ headerShown: true }}>
        {/* Auth Wrapper */}
        <Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />

        {/* Main Screens */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={({ navigation }) => ({
            title: 'Home',
            headerLeft: () =>
              navigation.canGoBack() && (
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 10 }}>
                  <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
              ),
          })}
        />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="Jobs" component={JobsScreen} />
        <Stack.Screen name="Events" component={EventsScreen} />
        <Stack.Screen name="Appointments" component={AppointmentsScreen} />
        <Stack.Screen name="AppointmentsScreen" component={AppointmentsScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Experts" component={ExpertsScreen} />
        <Stack.Screen name="BookAppointmentScreen" component={BookAppointmentScreen} />

        {/* Admin Screens */}
        <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
        <Stack.Screen name="ManageJobs" component={ManageJobsScreen} />
        <Stack.Screen name="ManageEvents" component={ManageEventsScreen} />
        <Stack.Screen name="ManageExperts" component={ManageExpertsScreen} />
        <Stack.Screen name="AdminAppointments" component={AdminAppointmentsScreen} />

        {/* ✅ Settings Module Screens (with correct filenames) */}
        <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} options={{ title: 'Change Password' }} />
        <Stack.Screen name="NotificationPreferencesScreen" component={NotificationPreferencesScreen} options={{ title: 'Notifications' }} />
        <Stack.Screen name="PrivacyPolicyScreen" component={PrivacyPolicyScreen} options={{ title: 'Privacy Policy' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
