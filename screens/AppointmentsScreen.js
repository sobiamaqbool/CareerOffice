import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, FlatList, StyleSheet, Text, View } from 'react-native';
import { auth, db } from './firebase';

export default function AppointmentsScreen() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      const user = auth.currentUser;
      const q = query(collection(db, 'appointments'), where('studentId', '==', user.uid));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (id) => {
    Alert.alert(
      'Confirm Cancel',
      'Are you sure you want to cancel this appointment?',
      [
        { text: 'No' },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'appointments', id));
              Alert.alert('Canceled', 'Your appointment has been canceled.');
              fetchAppointments(); // Refresh
            } catch (error) {
              Alert.alert('Error', error.message);
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.expert}>Expert: {item.expertName}</Text>
      <Text>Topic: {item.topic?.trim()}</Text>
      <Text>Slot: {item.slot}</Text>
      <Text>Mode: {item.mode}</Text>
      <Text>Status: {item.status}</Text>
      <Button title="Cancel Appointment" color="#FF3B30" onPress={() => cancelAppointment(item.id)} />
    </View>
  );

  return (
    <FlatList
      data={appointments}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#2F318D',
  },
  expert: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#2F318D',
    marginBottom: 4,
  },
});
