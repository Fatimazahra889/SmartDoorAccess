import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet } from 'react-native';

const initialUsers = [
  { id: '1', name: 'Mother', uid: '1234' },
  { id: '2', name: 'Son', uid: '123' },
];

export default function AuthorizedUsersScreen() {
  const [users, setUsers] = useState(initialUsers);
  const [name, setName] = useState('');
  const [uid, setUid] = useState('');

  const addUser = () => {
    if (!name || !uid) return;
    const newUser = { id: Date.now().toString(), name, uid };
    setUsers([...users, newUser]);
    setName('');
    setUid('');
  };

  const removeUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Authorized Users</Text>
      <FlatList
        data={users}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>{item.name} ({item.uid})</Text>
            <Button title="Remove" onPress={() => removeUser(item.id)} />
          </View>
        )}
      />
      <TextInput placeholder="Name" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="UID" value={uid} onChangeText={setUid} style={styles.input} />
      <Button title="Add User" onPress={addUser} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  card: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 6,
    padding: 8,
    marginBottom: 10,
  },
});
