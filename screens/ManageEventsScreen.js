// ManageEventsScreen.js - Admin-only event posting and deletion
import { MaterialIcons } from '@expo/vector-icons';
import { addDoc, collection, deleteDoc, doc, getDocs, Timestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  Alert, FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View
} from 'react-native';
import { db } from './firebase';

export default function ManageEventsScreen() {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [mode, setMode] = useState('');
  const [description, setDescription] = useState('');
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'events'));
      const eventList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents(eventList);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSubmit = async () => {
    if (!name || !date || !time || !location || !mode || !description) {
      Alert.alert('Validation Error', 'Please fill all fields');
      return;
    }

    try {
      await addDoc(collection(db, 'events'), {
        name,
        date,
        time,
        location,
        mode,
        description,
        postedAt: Timestamp.now(),
      });
      Alert.alert('Success', 'Event posted successfully!');
      setName('');
      setDate('');
      setTime('');
      setLocation('');
      setMode('');
      setDescription('');
      fetchEvents();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleDelete = async (id) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this event?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete', style: 'destructive', onPress: async () => {
            try {
              await deleteDoc(doc(db, 'events', id));
              setEvents(prev => prev.filter(item => item.id !== id));
              Alert.alert('Deleted', 'Event deleted successfully.');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete event.');
            }
          }
        }
      ]
    );
  };

  const renderEvent = ({ item }) => (
    <View style={styles.eventCard}>
      <Text style={styles.eventTitle}>{item.name}</Text>
      <Text style={styles.eventMeta}>📅 {item.date} at {item.time}</Text>
      <Text style={styles.eventMeta}>📍 {item.location} ({item.mode})</Text>
      <Text style={styles.eventDesc}>{item.description}</Text>
      <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
        <MaterialIcons name="delete" size={20} color="#fff" />
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Post a New Event</Text>

      <TextInput style={styles.input} placeholder="Event Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Date (YYYY-MM-DD)" value={date} onChangeText={setDate} />
      <TextInput style={styles.input} placeholder="Time (HH:MM)" value={time} onChangeText={setTime} />
      <TextInput style={styles.input} placeholder="Location" value={location} onChangeText={setLocation} />
      <TextInput style={styles.input} placeholder="Mode (online/in-person)" value={mode} onChangeText={setMode} />
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Event Description"
        multiline
        value={description}
        onChangeText={setDescription}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Post Event</Text>
      </TouchableOpacity>

      <Text style={[styles.heading, { marginTop: 30 }]}>Posted Events</Text>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={renderEvent}
        contentContainerStyle={{ paddingBottom: 30 }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fefefe',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2F318D'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#2F318D',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  eventCard: {
    backgroundColor: '#eef0ff',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    elevation: 2,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2F318D',
  },
  eventMeta: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
  },
  eventDesc: {
    color: '#333',
    marginBottom: 10,
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FF4D4D',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  deleteText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 6,
  },
});
