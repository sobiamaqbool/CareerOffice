import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { db } from './firebase';

export default function JobsScreen() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'jobListings'));
      const jobList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setJobs(jobList);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const renderItem = ({ item }) => (
    <JobCard
      title={item.title}
      company={item.company}
      location={item.location}
      deadline={item.deadline}
      description={item.description}
    />
  );

  return (
    <ImageBackground
      source={require('../assets/bg-jobs.png')} // ✅ replace with your path
      style={styles.background}
      resizeMode="cover"
    >
      <BlurView intensity={100} tint="light" style={styles.blurContainer}>
        {loading ? (
          <ActivityIndicator size="large" style={{ marginTop: 50 }} />
        ) : (
          <FlatList
            contentContainerStyle={styles.container}
            data={jobs}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
          />
        )}
      </BlurView>
    </ImageBackground>
  );
}

function JobCard({ title, company, location, deadline, description }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.company}>{company}</Text>

      <View style={styles.infoRow}>
        <MaterialIcons name="location-on" size={18} color="#2F318D" />
        <Text style={styles.infoText}>{location}</Text>
      </View>

      <View style={styles.infoRow}>
        <MaterialIcons name="calendar-today" size={18} color="#2F318D" />
        <Text style={styles.infoText}>Deadline: {deadline}</Text>
      </View>

      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  blurContainer: {
    flex: 1,
  },
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#ffffffdd', // semi-transparent for readability
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2F318D',
    marginBottom: 4,
  },
  company: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 13,
    color: '#333',
    marginLeft: 6,
  },
  description: {
    fontSize: 14,
    color: '#444',
    marginTop: 10,
    lineHeight: 20,
  },
});
