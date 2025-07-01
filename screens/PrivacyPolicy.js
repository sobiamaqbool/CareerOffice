import { ScrollView, StyleSheet, Text } from 'react-native';

export default function PrivacyPolicyScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Privacy Policy</Text>

      <Text style={styles.body}>
        Welcome to our application. This Privacy Policy outlines how we collect, use, and safeguard your information. By using this app, you acknowledge and agree to the practices described herein.
      </Text>

      <Text style={styles.heading}>1. Information Collection</Text>
      <Text style={styles.body}>
        We may collect personal information such as your name, email address, and app usage data. This occurs when you register, book appointments, upload resumes, or interact with app features.
      </Text>

      <Text style={styles.heading}>2. Use of Information</Text>
      <Text style={styles.body}>
        The information we collect is used to:
        {"\n"}• Deliver and improve app functionality (e.g., job listings, appointment bookings)
        {"\n"}• Send timely notifications and important updates
        {"\n"}• Enhance the overall user experience
      </Text>

      <Text style={styles.heading}>3. Data Protection</Text>
      <Text style={styles.body}>
        We implement industry-standard security measures to safeguard your personal data. While we strive to protect your information, please note that no method of transmission over the internet or electronic storage is completely secure.
      </Text>

      <Text style={styles.heading}>4. Third-Party Services</Text>
      <Text style={styles.body}>
        Some app features may rely on third-party services, such as Firebase. The use and protection of data by these services are governed by their respective privacy policies.
      </Text>

      <Text style={styles.heading}>5. User Consent</Text>
      <Text style={styles.body}>
        By using this application, you consent to the collection and use of information as outlined in this Privacy Policy.
      </Text>

      <Text style={styles.heading}>6. Policy Updates</Text>
      <Text style={styles.body}>
        We may revise this Privacy Policy from time to time. Any changes will be reflected within the app and will take effect immediately upon posting.
      </Text>

      <Text style={styles.footer}>
        Last updated: June 26, 2025
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 20, color: '#2F318D' },
  heading: { fontSize: 18, fontWeight: '600', marginTop: 20, marginBottom: 8, color: '#2F318D' },
  body: { fontSize: 16, lineHeight: 24, color: '#333' },
  footer: { fontSize: 14, color: '#666', marginTop: 30, fontStyle: 'italic', textAlign: 'center' }
});
