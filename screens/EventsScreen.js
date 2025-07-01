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

export default function EventsScreen() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'events'));
      const eventList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEvents(eventList);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.dateTime}>{item.date} • {item.time}</Text>
      <Text style={styles.location}>📍 {item.location}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  return (
    <ImageBackground
      source={require('../assets/bg-events.png')} // replace with your actual path
      style={styles.background}
      resizeMode="cover"
    >
      <BlurView intensity={100} tint="light" style={styles.blurContainer}>
        {loading ? (
          <ActivityIndicator size="large" style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            contentContainerStyle={styles.container}
            data={events}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
          />
        )}
      </BlurView>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  blurContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  container: {
    paddingBottom: 40,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2F318D',
    marginBottom: 6,
  },
  dateTime: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#333',
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2F318D',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
});
