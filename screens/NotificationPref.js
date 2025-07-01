import { useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

export default function NotificationPreferencesScreen() {
  const [jobAlerts, setJobAlerts] = useState(true);
  const [eventAlerts, setEventAlerts] = useState(true);
  const [appointmentReminders, setAppointmentReminders] = useState(true);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notification Preferences</Text>

      <View style={styles.optionRow}>
        <Text style={styles.label}>Job Alerts</Text>
        <Switch
          value={jobAlerts}
          onValueChange={setJobAlerts}
        />
      </View>

      <View style={styles.optionRow}>
        <Text style={styles.label}>Event Alerts</Text>
        <Switch
          value={eventAlerts}
          onValueChange={setEventAlerts}
        />
      </View>

      <View style={styles.optionRow}>
        <Text style={styles.label}>Appointment Reminders</Text>
        <Switch
          value={appointmentReminders}
          onValueChange={setAppointmentReminders}
        />
      </View>

      <Text style={styles.infoText}>
        * These preferences are currently local only. To persist them, connect to Firestore or AsyncStorage.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  label: { fontSize: 18 },
  infoText: {
    marginTop: 30,
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic'
  }
});
