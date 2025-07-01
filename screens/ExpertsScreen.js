// Updated ExpertsScreen.js with calendar-based filtering by expert availability
import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { db } from './firebase';

export default function ExpertsScreen({ navigation }) {
  const [experts, setExperts] = useState([]); // List of experts to display
  const [loading, setLoading] = useState(true); // Loader state
  const [selectedSlots, setSelectedSlots] = useState({}); // Tracks selected slots per expert
  const [selectedDate, setSelectedDate] = useState(null); // Tracks selected calendar date

  // Normalize selected date for Firestore key access (no zero-padding)
  const formatDateKey = (dateStr) => {
    const dateObj = new Date(dateStr);
    return `${dateObj.getFullYear()}-${dateObj.getMonth() + 1}-${dateObj.getDate()}`;
  };

  // Fetches experts and filters their slots by availability on the selected date
  const fetchExperts = async () => {
    try {
      const expertSnapshot = await getDocs(collection(db, 'experts'));
      const expertList = expertSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      const appointmentSnapshot = await getDocs(collection(db, 'appointments'));
      const takenSlotsMap = {}; // Map to track taken slots per expert per date

      appointmentSnapshot.forEach(doc => {
        const data = doc.data();
        if (data.status === 'confirmed' || data.status === 'booked') {
          const { expertId, slot, date } = data;
          const key = `${expertId}_${date}`;
          if (!takenSlotsMap[key]) takenSlotsMap[key] = [];
          takenSlotsMap[key].push(slot);
        }
      });

      const formattedDate = formatDateKey(selectedDate);

      // Filter available slots based on selected date and already booked ones
      const updatedExperts = expertList.map(expert => {
        const dailySlots = Array.isArray(expert.availability?.[formattedDate])
          ? expert.availability[formattedDate]
          : [];
        const key = `${expert.id}_${formattedDate}`;
        const taken = takenSlotsMap[key] || [];
        const filteredSlots = dailySlots.filter(slot => !taken.includes(slot));

        return {
          ...expert,
          availableSlots: filteredSlots,
        };
      });

      setExperts(updatedExperts);
    } catch (error) {
      console.error('Error fetching experts or appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  // Set today's date as default selection
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
  }, []);

  useEffect(() => {
    if (selectedDate) fetchExperts();
  }, [selectedDate]);

  const handleSlotSelect = (expertId, slot) => {
    setSelectedSlots(prev => ({ ...prev, [expertId]: slot }));
  };

  const handleNavigateToBooking = (expertItem) => {
    const selectedSlot = selectedSlots[expertItem.id];
    navigation.navigate('BookAppointmentScreen', {
      expert: expertItem,
      slot: selectedSlot,
      date: selectedDate,
    });
  };

  // Renders each expert card
  const renderItem = ({ item }) => {
    const selectedSlot = selectedSlots[item.id] || null;
    const noSlotsLeft = !item.availableSlots || item.availableSlots.length === 0;

    return (
      <View style={styles.card}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.role}>{item.title} ({item.mode})</Text>
        <Text style={styles.bio}>{item.bio}</Text>
        <Text style={styles.sub}>Select a Slot:</Text>

        {noSlotsLeft ? (
          <Text style={{ color: 'gray', marginTop: 6 }}>No slots available</Text>
        ) : (
          <View style={styles.slotList}>
            {item.availableSlots.map((slot, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.slotButton,
                  selectedSlot === slot && styles.selectedSlot,
                ]}
                onPress={() => handleSlotSelect(item.id, slot)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.slotText,
                    selectedSlot === slot && { color: 'white' },
                  ]}
                >
                  {slot}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.button,
            (!selectedSlot || noSlotsLeft) && { backgroundColor: '#ccc' },
          ]}
          disabled={!selectedSlot || noSlotsLeft}
          onPress={() => handleNavigateToBooking(item)}
        >
          <Text style={styles.buttonText}>
            {noSlotsLeft ? 'Fully Booked' : 'Book Appointment'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Calendar to pick date */}
      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: '#2F318D' },
        }}
      />

      {/* Experts filtered based on date */}
      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          contentContainerStyle={styles.container}
          data={experts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 16,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2F318D',
  },
  role: {
    fontSize: 16,
    color: '#2F318D',
    marginBottom: 4,
  },
  bio: {
    marginBottom: 8,
    color: '#333',
  },
  sub: {
    fontWeight: '600',
    marginTop: 6,
    color: '#2F318D',
  },
  slotList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 8,
  },
  slotButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: '#E8EAF6',
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedSlot: {
    backgroundColor: '#2F318D',
  },
  slotText: {
    color: '#2F318D',
    fontWeight: 'bold',
    fontSize: 13,
  },
  button: {
    backgroundColor: '#2F318D',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
