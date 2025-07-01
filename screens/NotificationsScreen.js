import { MaterialIcons } from '@expo/vector-icons';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { triggerNotification } from '../notifications'; // adjust path

const dummyNotifications = [
  {
    id: '1',
    title: 'New Job Posted!',
    body: 'Software Intern at XYZ is now open.',
    time: 'Just now',
  },
  {
    id: '2',
    title: 'Event Reminder',
    body: 'Resume Workshop at 3 PM today.',
    time: '1 hour ago',
  },
];

export default function NotificationsScreen() {
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <MaterialIcons name="notifications-active" size={24} color="#2F318D" style={styles.icon} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.body}>{item.body}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.screen}>
      <FlatList
        data={dummyNotifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            triggerNotification(
              'New Internship Alert!',
              'AI Research Intern opportunity available now.'
            )
          }
        >
          <Text style={styles.buttonText}>Trigger Test Notification</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f7f8ff',
  },
  list: {
    padding: 16,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 12,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  icon: {
    marginRight: 12,
    marginTop: 4,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontWeight: '700',
    fontSize: 16,
    color: '#2F318D',
    marginBottom: 4,
  },
  body: {
    fontSize: 14,
    color: '#444',
  },
  time: {
    fontSize: 12,
    color: '#888',
    marginTop: 6,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#2F318D',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 3,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
