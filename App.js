import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  NativeModules,
  NativeEventEmitter,
  SafeAreaView,
  StatusBar,
} from 'react-native';

const { NativeCommunication } = NativeModules;
const eventEmitter = NativeCommunication ? new NativeEventEmitter(NativeCommunication) : null;

export default function App() {
  const [receivedMessage, setReceivedMessage] = useState('No message received from native yet');
  const [inputMessage, setInputMessage] = useState('');

  useEffect(() => {
    if (!eventEmitter) return;

    const subscription = eventEmitter.addListener('NativeToExpoEvent', (event) => {
      setReceivedMessage(event.message || JSON.stringify(event));
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleSendToNative = () => {
    const text = inputMessage.trim() || 'Hello from Expo Brownfield React Native!';
    if (NativeCommunication && NativeCommunication.sendMessageToNative) {
      NativeCommunication.sendMessageToNative(text);
      setInputMessage('');
    } else {
      alert('NativeCommunication module not found. Run inside Native app container.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.card}>
        <Text style={styles.title}>🚀 Expo Brownfield Screen</Text>
        <Text style={styles.subtitle}>React Native View hosted inside Native Android</Text>

        <View style={styles.box}>
          <Text style={styles.boxLabel}>Message received from Native Android:</Text>
          <Text style={styles.messageText}>{receivedMessage}</Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type message for Native Android..."
            placeholderTextColor="#888"
            value={inputMessage}
            onChangeText={setInputMessage}
          />
          <TouchableOpacity style={styles.button} onPress={handleSendToNative}>
            <Text style={styles.buttonText}>Send to Native Android</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
  box: {
    backgroundColor: '#EFF6FF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginBottom: 20,
  },
  boxLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1D4ED8',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    color: '#1E3A8A',
    fontWeight: '500',
  },
  inputContainer: {
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
  },
  button: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
