// AdminAppointmentsScreen.js - Displays all booked appointments with delete option
import { collection, deleteDoc, doc, getDocs, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from './firebase';

export default function AdminAppointmentsScreen() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      const q = query(collection(db, 'appointments'), orderBy('bookedAt', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAppointments(data);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this appointment?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'appointments', id));
              setAppointments(prev => prev.filter(item => item.id !== id));
              Alert.alert('Deleted', 'Appointment deleted successfully.');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete appointment.');
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
      <Text style={styles.student}>Student: {item.studentEmail}</Text>
      <Text>Topic: {item.topic?.trim()}</Text>
      <Text>Date: {item.date}</Text>
      <Text>Slot: {item.slot}</Text>
      <Text>Mode: {item.mode}</Text>
      <Text>Status: {item.status}</Text>
      <TouchableOpacity onPress={() => handleDelete(item.id)}>
        <Text style={styles.delete}>❌ Delete Appointment</Text>
      </TouchableOpacity>
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
  student: {
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  delete: {
    marginTop: 10,
    color: 'red',
    fontWeight: 'bold',
  },
});
