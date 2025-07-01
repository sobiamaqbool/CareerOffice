// app/ChatScreen.js
import { Platform, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function ChatScreen() {
  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: 'https://tawk.to/chat/685d748e96f0d9190ce49aeb/1iumgujbg' }}
        style={styles.webview}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: Platform.OS === 'android' ? 20 : 0, // adds space for Android nav bar
    backgroundColor: '#fff',
  },
  webview: {
    flex: 1,
  },
});
