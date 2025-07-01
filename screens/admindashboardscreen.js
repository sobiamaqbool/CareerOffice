import { MaterialIcons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AdminDashboardScreen({ navigation }) {
  const Card = ({ title, onPress, iconName }) => (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <MaterialIcons name={iconName} size={26} color="#2F318D" style={styles.cardIcon} />
      <Text style={styles.cardText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.screenWrapper}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Counsellor Dashboard</Text>

        <Card
          title="Manage Job Listings"
          iconName="work-outline"
          onPress={() => navigation.navigate('ManageJobs')}
        />
        <Card
          title="Manage Events & Workshops"
          iconName="event-note"
          onPress={() => navigation.navigate('ManageEvents')}
        />
        <Card
          title="Manage Expert Profiles"
          iconName="people-outline"
          onPress={() => navigation.navigate('ManageExperts')}
        />
        <Card
          title="View Appointments"
          iconName="calendar-today"
          onPress={() => navigation.navigate('AdminAppointments')}
        />
        <Card
          title="Student Dashboard Preview"
          iconName="dashboard"
          onPress={() => navigation.navigate('Home')}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 24,
    textAlign: 'center',
    color: '#2F318D',
  },
  card: {
    backgroundColor: '#f4f4f4',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardIcon: {
    marginRight: 12,
  },
  cardText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2F318D',
  },
});
