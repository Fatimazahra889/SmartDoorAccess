import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';

type LogEntry = {
  uid: string;
  name: string;
  time: string;
  granted: boolean;
};

export default function NotificationsScreen() {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    fetch('http://846f-41-141-173-42.ngrok-free.app/logs') 
      .then((res) => res.json())
      .then((data) => setLogs(data))
      .catch((err) => console.error('Failed to fetch logs', err));
  }, []);

  const today = new Date().toDateString();

  const todayLogs = logs.filter((log) => new Date(log.time).toDateString() === today);
  const yesterdayLogs = logs.filter((log) => new Date(log.time).toDateString() !== today);

  const LogItem: React.FC<{ item: LogEntry }> = ({ item }) => (
    <View style={[styles.card, item.granted ? styles.success : styles.denied]}>
      <Image
        source={
          item.name === 'Father'
            ? require('../assets/users/father.jpg')
            : item.name === 'Mother'
            ? require('../assets/users/mother.jpg')
            : item.name === 'Son'
            ? require('../assets/users/son.jpg')
            : require('../assets/users/unknown.jpg')
        }
        style={styles.avatar}
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.message}>
          <Text style={{ fontWeight: '600' }}>{item.name}</Text>{' '}
          {item.granted ? 'unlocked' : 'tried to unlock'} the door
        </Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Notifications</Text>

      <Text style={styles.section}>Today</Text>
      <FlatList
        data={todayLogs}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => <LogItem item={item} />}
      />

      <Text style={styles.section}>Yesterday</Text>
      <FlatList
        data={yesterdayLogs}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => <LogItem item={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40, paddingHorizontal: 15 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  section: { fontSize: 16, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  message: { fontSize: 14 },
  time: { fontSize: 12, color: 'gray' },
  success: { backgroundColor: '#d4fcd4' },
  denied: { backgroundColor: '#ffd6d6' },
});
