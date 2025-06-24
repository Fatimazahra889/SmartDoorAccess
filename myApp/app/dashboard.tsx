import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { getLogs, AccessLog } from './lib/api';


export default function Dashboard() {
  const [logs, setLogs] = useState<AccessLog[]>([]);
  const [alertShown, setAlertShown] = useState(false);

  const fetchLogs = async () => {
    try {
      const data = await getLogs();
      setLogs(data.logs);

      // Show intruder alert
      const intruder = data.logs.find((log: AccessLog) => log.name.toLowerCase() === 'unknown');
      if (intruder && !alertShown) {
        Alert.alert("🚨 ALERT!", "Someone unknown tried to access the house!", [
          { text: "OK", onPress: () => setAlertShown(true) },
        ]);
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📋 Access Logs</Text>
      <FlatList
        data={logs}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>{item.name} entered at {item.timestamp}</Text>
          </View>
        )}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f0f8ff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  card: {
    backgroundColor: 'white',
    borderWidth: 2,
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
  },
  name: { fontSize: 18, fontWeight: 'bold' },
  uid: { fontSize: 14, color: '#555' },
  time: { fontSize: 12, color: '#777' },
});
