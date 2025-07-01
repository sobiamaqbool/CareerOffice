// ManageJobsScreen.js - Admin-only job posting and deletion
import { MaterialIcons } from '@expo/vector-icons';
import { addDoc, collection, deleteDoc, doc, getDocs, Timestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  Alert, FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View
} from 'react-native';
import { db } from './firebase';

export default function ManageJobsScreen() {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [deadline, setDeadline] = useState('');
  const [description, setDescription] = useState('');
  const [jobs, setJobs] = useState([]);

  const fetchJobs = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'jobListings'));
      const jobList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setJobs(jobList);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSubmit = async () => {
    if (!title || !company || !location || !deadline || !description) {
      Alert.alert('Validation Error', 'Please fill all fields');
      return;
    }

    try {
      await addDoc(collection(db, 'jobListings'), {
        title,
        company,
        location,
        deadline,
        description,
        postedAt: Timestamp.now(),
      });
      Alert.alert('Success', 'Job posted successfully!');
      setTitle('');
      setCompany('');
      setLocation('');
      setDeadline('');
      setDescription('');
      fetchJobs();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleDelete = async (id) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this job posting?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete', style: 'destructive', onPress: async () => {
            try {
              await deleteDoc(doc(db, 'jobListings', id));
              setJobs(prev => prev.filter(item => item.id !== id));
              Alert.alert('Deleted', 'Job deleted successfully.');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete job.');
            }
          }
        }
      ]
    );
  };

  const renderJob = ({ item }) => (
    <View style={styles.jobCard}>
      <Text style={styles.jobTitle}>{item.title}</Text>
      <Text style={styles.jobCompany}>{item.company}</Text>
      <Text style={styles.jobMeta}>📍 {item.location} | 📅 {item.deadline}</Text>
      <Text style={styles.jobDesc}>{item.description}</Text>
      <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
        <MaterialIcons name="delete" size={20} color="#fff" />
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Post a New Job</Text>

      <TextInput style={styles.input} placeholder="Job Title" value={title} onChangeText={setTitle} />
      <TextInput style={styles.input} placeholder="Company" value={company} onChangeText={setCompany} />
      <TextInput style={styles.input} placeholder="Location" value={location} onChangeText={setLocation} />
      <TextInput style={styles.input} placeholder="Deadline (YYYY-MM-DD)" value={deadline} onChangeText={setDeadline} />
      <TextInput style={[styles.input, { height: 100 }]} placeholder="Job Description" multiline value={description} onChangeText={setDescription} />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Post Job</Text>
      </TouchableOpacity>

      <Text style={[styles.heading, { marginTop: 30 }]}>Posted Jobs</Text>
      <FlatList
        data={jobs}
        keyExtractor={(item) => item.id}
        renderItem={renderJob}
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
  jobCard: {
    backgroundColor: '#eef0ff',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    elevation: 2,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2F318D',
  },
  jobCompany: {
    color: '#444',
    marginBottom: 4,
  },
  jobMeta: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  jobDesc: {
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
