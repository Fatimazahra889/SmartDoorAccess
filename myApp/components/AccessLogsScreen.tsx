import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const logs = [
  { id: '1', name: 'Mother', uid: '1234', time: '2025-06-20 12:30', status: 'Authorized' },
  { id: '2', name: 'UNKNOWN', uid: 'ZZZZ', time: '2025-06-20 12:32', status: 'Denied' },
];

export default function AccessLogsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Access Logs</Text>
      <FlatList
        data={logs}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[styles.card, item.status === 'Denied' && styles.denied]}>
            <Text>{item.time}</Text>
            <Text>{item.name} ({item.uid})</Text>
            <Text>Status: {item.status}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  card: {
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#d0f0d0',
    borderRadius: 8,
  },
  denied: {
    backgroundColor: '#fdd',
  },
});
