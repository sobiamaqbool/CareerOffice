import { addDoc, collection, getDocs, query, Timestamp, where } from 'firebase/firestore';
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

export default function BookAppointmentScreen({ route, navigation }) {
  const { expert, slot } = route.params; // receiving slot from ExpertsScreen
  const [topic, setTopic] = useState('');

  const handleConfirm = async () => {
    if (!topic.trim()) {
      Alert.alert('Error', 'Please enter a topic');
      return;
    }

    try {
      const user = auth.currentUser;

      // Check if this slot is already booked
      const existing = await getDocs(
        query(
          collection(db, 'appointments'),
          where('expertId', '==', expert.id),
          where('slot', '==', slot),
          where('status', '==', 'confirmed')
        )
      );

      if (!existing.empty) {
        Alert.alert('Error', 'This slot has already been booked.');
        return;
      }

      await addDoc(collection(db, 'appointments'), {
        studentId: user.uid,
        studentEmail: user.email,
        expertId: expert.id,
        expertName: expert.name,
        topic: topic.trim(),
        slot: slot, // passed from expert screen
        mode: expert.mode, // passed from expert screen
        status: 'confirmed',
        bookedAt: Timestamp.now(),
      });

      Alert.alert('Success', 'Appointment booked successfully!');
      navigation.navigate('AppointmentsScreen');
    } catch (error) {
      Alert.alert('Booking Failed', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Booking with: <Text style={styles.bold}>{expert.name}</Text>
      </Text>
      <Text style={styles.label}>Mode: <Text style={styles.bold}>{expert.mode}</Text></Text>
      <Text style={styles.label}>Slot: <Text style={styles.bold}>{slot}</Text></Text>

      <TextInput
        style={styles.input}
        placeholder="Enter topic of discussion"
        value={topic}
        onChangeText={setTopic}
      />
      <TouchableOpacity style={styles.button} onPress={handleConfirm}>
        <Text style={styles.buttonText}>Confirm Appointment</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    fontSize: 18,
    marginBottom: 6,
  },
  bold: {
    fontWeight: 'bold',
    color: '#2F318D',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginVertical: 14,
  },
  button: {
    backgroundColor: '#2F318D',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
