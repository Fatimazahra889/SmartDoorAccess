import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';

type AlertLog = {
  name: string;
  time: string;
  granted: boolean;
};

export default function AlertsScreen() {
  const [logs, setLogs] = useState<AlertLog[]>([]);

  const fetchLogs = async () => {
    try {
      const res = await fetch('http://846f-41-141-173-42.ngrok-free.app/logs');
      const data = await res.json();
      setLogs(data);
    } catch (err) {
      console.error('Failed to load logs:', err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const renderItem = ({ item }: { item: AlertLog }) => (
    <View style={[styles.card, item.granted ? styles.success : styles.danger]}>
      <Image
        source={
          item.name === 'Unknown'
            ? require('../assets/icons/unknown.png')
            : item.name === 'Father'
            ? require('../assets/users/father.jpg')
            : item.name === 'Mother'
            ? require('../assets/users/mother.jpg')
            : require('../assets/users/son.jpg')
        }
        style={styles.image}
      />
      <View style={styles.details}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.status}>
          {item.granted ? 'unlocked the door' : 'tried to unlock the door'}
        </Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>UnLok</Text>
      <FlatList
        data={logs}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40, backgroundColor: '#000' },
  title: { fontSize: 24, fontWeight: 'bold', color: 'white', textAlign: 'center', marginBottom: 20 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
  },
  success: { backgroundColor: '#d4f8d4' },
  danger: { backgroundColor: '#ffe0e0' },
  image: { width: 50, height: 50, borderRadius: 25, marginRight: 16 },
  details: { flex: 1 },
  name: { fontWeight: 'bold', fontSize: 16 },
  status: { marginTop: 4, fontSize: 14 },
  time: { marginTop: 4, fontSize: 12, color: '#555' },
});
