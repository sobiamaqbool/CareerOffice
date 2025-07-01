// ManageExpertsScreen.js - Updated to support availability with dates and slots
import { addDoc, collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { db } from './firebase';

export default function ManageExpertsScreen() {
  const [experts, setExperts] = useState([]);
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [mode, setMode] = useState('in-person');
  const [bio, setBio] = useState('');
  const [date, setDate] = useState(''); // e.g., 2025-7-6
  const [slots, setSlots] = useState(''); // comma-separated times

  const fetchExperts = async () => {
    const snapshot = await getDocs(collection(db, 'experts'));
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setExperts(data);
  };

  useEffect(() => {
    fetchExperts();
  }, []);

  const handleAdd = async () => {
    if (!name || !title || !mode || !bio || !date || !slots) {
      Alert.alert('Validation', 'All fields are required.');
      return;
    }

    try {
      const slotList = slots.split(',').map(s => s.trim());
      const availability = { [date]: slotList };

      await addDoc(collection(db, 'experts'), {
        name,
        title,
        mode,
        bio,
        availability,
      });

      setName('');
      setTitle('');
      setMode('in-person');
      setBio('');
      setDate('');
      setSlots('');
      fetchExperts();
      Alert.alert('Success', 'Expert added successfully.');
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'experts', id));
      fetchExperts();
    } catch (e) {
      Alert.alert('Error', 'Could not delete expert.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add Expert</Text>

      <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Title" value={title} onChangeText={setTitle} />
      <TextInput style={styles.input} placeholder="Mode (in-person / Zoom)" value={mode} onChangeText={setMode} />
      <TextInput style={styles.input} placeholder="Short Bio" value={bio} onChangeText={setBio} />
      <TextInput style={styles.input} placeholder="Date (e.g., 2025-7-6)" value={date} onChangeText={setDate} />
      <TextInput style={styles.input} placeholder="Available Slots (e.g., 2:00pm, 3:30pm)" value={slots} onChangeText={setSlots} />

      <Button title="Add Expert" onPress={handleAdd} color="#2F318D" />

      <Text style={[styles.heading, { marginTop: 24 }]}>Existing Experts</Text>
      <FlatList
        data={experts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.meta}>{item.title} ({item.mode})</Text>
            <Text style={styles.bio}>{item.bio}</Text>
            <Text style={styles.avail}>Availability:</Text>
            {item.availability ? (
              Object.entries(item.availability).map(([dateKey, slots]) => (
                <Text key={dateKey} style={styles.slots}>
                  {dateKey}: {Array.isArray(slots) ? slots.join(', ') : slots}
                </Text>
              ))
            ) : (
              <Text style={styles.slots}>None</Text>
            )}
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
              <Text style={styles.delete}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fefefe',
    flex: 1,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 16,
    fontFamily: 'Roboto'
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  meta: {
    color: '#666',
  },
  bio: {
    marginVertical: 4,
  },
  avail: {
    fontWeight: 'bold',
    marginTop: 6,
  },
  slots: {
    fontSize: 13,
    color: '#333',
    marginLeft: 6,
  },
  delete: {
    color: 'red',
    marginTop: 6,
    fontWeight: 'bold',
  },
});
