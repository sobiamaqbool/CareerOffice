import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useLayoutEffect } from 'react';
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function HomeScreen({ navigation }) {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerBackTitleVisible: false,
    });
  }, [navigation]);

  const IconButton = ({ icon, label, onPress }) => (
    <TouchableOpacity style={styles.iconCard} onPress={onPress}>
      {icon}
      <Text style={styles.iconLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../assets/homebg.png')} // Make sure image exists in assets
      style={styles.background}
      imageStyle={{ opacity: 0.15 }}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>LaunchPad NIIT</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Text style={styles.headerIcon}>👤</Text>
          </TouchableOpacity>
        </View>

        {/* Dashboard */}
        <ScrollView contentContainerStyle={styles.dashboard}>
          <View style={styles.row}>
            <IconButton
              icon={<MaterialIcons name="person" size={24} color="#2F318D" />}
              label="Profile"
              onPress={() => navigation.navigate('Profile')}
            />
            <IconButton
              icon={<FontAwesome5 name="briefcase" size={24} color="#2F318D" />}
              label="Jobs"
              onPress={() => navigation.navigate('Jobs')}
            />
          </View>
          <View style={styles.row}>
            <IconButton
              icon={<MaterialIcons name="event" size={24} color="#2F318D" />}
              label="Events"
              onPress={() => navigation.navigate('Events')}
            />
            <IconButton
              icon={<MaterialIcons name="schedule" size={24} color="#2F318D" />}
              label="Appointments"
              onPress={() => navigation.navigate('Appointments')}
            />
          </View>
          <View style={styles.row}>
            <IconButton
              icon={<FontAwesome5 name="chalkboard-teacher" size={24} color="#2F318D" />}
              label="Experts"
              onPress={() => navigation.navigate('Experts')}
            />
            <IconButton
              icon={<MaterialIcons name="notifications" size={24} color="#2F318D" />}
              label="Notifications"
              onPress={() => navigation.navigate('Notifications')}
            />
          </View>
          <View style={styles.row}>
            <IconButton
              icon={<MaterialIcons name="settings" size={24} color="#2F318D" />}
              label="Settings"
              onPress={() => navigation.navigate('Settings')}
            />
          </View>
        </ScrollView>

        {/* Floating Chat Button */}
        <TouchableOpacity
          style={styles.chatButton}
          onPress={() => navigation.navigate('Chat')}
        >
          <Text style={styles.chatIcon}>💬</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#2F318D',
  },
  headerIcon: {
    fontSize: 28,
    color: '#2F318D',
  },
  dashboard: {
    paddingBottom: 100,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 24,
  },
  iconCard: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 14,
    alignItems: 'center',
    width: '40%',
    elevation: 3,
  },
  iconLabel: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: '500',
    color: '#2F318D',
  },
  chatButton: {
    position: 'absolute',
    bottom: 25,
    right: 25,
    backgroundColor: '#2F318D',
    padding: 14,
    borderRadius: 30,
    elevation: 5,
  },
  chatIcon: {
    fontSize: 24,
    color: '#fff',
  },
});
