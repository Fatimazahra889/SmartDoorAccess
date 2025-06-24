import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { getLogs, AccessLog } from '../lib/api'; // adjust path
import { View, Text } from 'react-native';

const AlertsScreen = () => {
  const [logs, setLogs] = useState<AccessLog[]>([]);

  const fetchLogs = async () => {
    try {
      const data = await getLogs();
      setLogs(data); // it's a direct array now
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchLogs();
    }, [])
  );

  return (
    <View>
        {/* Render logs here */}
        <Text>Logs will appear here</Text>
    </View>
  );
};

export default AlertsScreen;
