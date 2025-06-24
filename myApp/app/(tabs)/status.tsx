import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import  io  from 'socket.io-client';

export default function StatusScreen() {
  const [status, setStatus] = useState<'locked' | 'unlocked'>('locked');
  const [name, setName] = useState('');

  useEffect(() => {
    const socket = io('http://192.168.56.1:5000');

    socket.on('status', (data: { status: 'locked' | 'unlocked'; name: string }) => {
      console.log('WebSocket Status:', data);
      setStatus(data.status);
      setName(data.name);

      if (data.status === 'unlocked') {
        setTimeout(() => setStatus('locked'), 3000);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const toggleLock = () => {
    setStatus((prev) => (prev === 'locked' ? 'unlocked' : 'locked'));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Door Status</Text>
      <Text style={[styles.status, status === 'unlocked' ? styles.unlocked : styles.locked]}>
        {status === 'unlocked' ? 'Unlocked 🔓' : 'Locked 🔒'}
      </Text>
      {name !== '' && <Text style={styles.name}>by {name}</Text>}

      <TouchableOpacity onPress={toggleLock}>
        <Image
          source={require('@/assets/icons/fingerprint.png')}
          style={styles.fingerprint}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 24,
    marginBottom: 10,
  },
  status: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  unlocked: {
    color: 'green',
  },
  locked: {
    color: 'red',
  },
  name: {
    fontSize: 18,
    color: '#555',
    marginBottom: 20,
  },
  fingerprint: {
    width: 80,
    height: 80,
    tintColor: '#333',
  },
});
