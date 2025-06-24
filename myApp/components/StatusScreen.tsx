import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import io from 'socket.io-client';

type StatusPayload = {
  name: string;
  status: string;
};

export default function StatusScreen() {
  const [status, setStatus] = useState<'locked' | 'unlocked'>('locked');
  const [lastUser, setLastUser] = useState<string>('');
  const [lastTime, setLastTime] = useState<string>('');

  useEffect(() => {
    const socket = io('http://192.168.56.1:5000'); 

    socket.on('connect', () => {
      console.log('[WS] Connected to gateway');
    });

    socket.on('status', (data: StatusPayload) => {
      console.log('[WS] Received status update:', data);
      setStatus('unlocked');
      setLastUser(data.name);
      setLastTime(new Date().toLocaleTimeString());

      // Reset after 10 seconds
      setTimeout(() => setStatus('locked'), 10000);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Front Door</Text>
      <Text style={[styles.status, { color: status === 'unlocked' ? 'green' : 'red' }]}>Status: {status.toUpperCase()}</Text>

      <Image
        source={
          status === 'unlocked'
            ? require('../assets/icons/lock-red.png')
            : require('../assets/icons/lock-green.png')
        }
        style={styles.lockIcon}
        resizeMode="contain"
      />

      {status === 'unlocked' && (
        <Text style={styles.lastAction}>{lastUser} unlocked at {lastTime}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  status: { fontSize: 20, marginBottom: 20 },
  lockIcon: { width: 180, height: 180, marginBottom: 30 },
  lastAction: { fontSize: 14, color: '#555' },
});
