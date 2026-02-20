import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  SafeAreaView 
} from 'react-native';
import { WebView } from 'react-native-webview';

export default function App() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  // This is the HTML string that will be rendered inside the WebView
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: -apple-system, system-ui, sans-serif;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #6e8efb, #a777e3);
            color: white;
            text-align: center;
          }
          h1 { font-size: 2.5rem; margin-bottom: 10px; }
          p { font-size: 1.1rem; opacity: 0.9; }
        </style>
      </head>
      <body>
        <h1>Hello World</h1>
        <p>This is rendered from a local HTML string.</p>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      {/* Main Screen Button */}
      <Text style={styles.title}>Expo WebView Demo</Text>
      <TouchableOpacity 
        style={styles.openButton} 
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={styles.buttonText}>Open Popup WebView</Text>
      </TouchableOpacity>

      {/* Popup Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <SafeAreaView style={styles.modalWrapper}>
          {/* Custom Header with Close Button */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>WebView Popup</Text>
            <TouchableOpacity 
              onPress={() => setIsModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Done</Text>
            </TouchableOpacity>
          </View>

          {/* WebView Rendering the HTML */}
          <WebView 
            originWhitelist={['*']}
            source={{ html: htmlContent }} 
            style={styles.webview}
          />
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  openButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  modalWrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    color: '#007AFF',
    fontSize: 17,
    fontWeight: 'bold',
  },
  webview: {
    flex: 1,
  },
});