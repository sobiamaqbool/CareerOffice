// app/ResumeScreen.js

import { StyleSheet, Text, View } from 'react-native';

export default function ResumeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Resume Upload / Builder</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 22,
    fontWeight: '600',
  },
});
