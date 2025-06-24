import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TextInput,
  TouchableOpacity,
  Modal,
  Button,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function MembersScreen() {
  const [members, setMembers] = useState([
    {
      name: 'Father',
      role: 'Owner',
      image: require('../assets/users/father.jpg'),
      code: '123456',
    },
    {
      name: 'Mother',
      role: 'Member',
      image: require('../assets/users/mother.jpg'),
      code: '1234',
    },
    {
      name: 'Son',
      role: 'Member',
      image: require('../assets/users/son.jpg'),
      code: '123',
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [newMember, setNewMember] = useState<{
    name: string;
    code: string;
    image: { uri: string } | null;
  }>({
    name: '',
    code: '',
    image: null,
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const handleAdd = async () => {
    if (!newMember.name || !newMember.code || !newMember.image) return;

    if (editIndex !== null) {
      const updated = [...members];
      updated[editIndex] = { ...updated[editIndex], ...newMember };
      setMembers(updated);
    } else {
      setMembers([...members, { ...newMember, role: 'Member' }]);
      try {
        await fetch('http://846f-41-141-173-42.ngrok-free.app/add-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: newMember.name,
            uid: newMember.code,
          }),
        });
      } catch (error) {
        console.error("Failed to send user to server:", error);
      }
    }

    setNewMember({ name: '', code: '', image: null });
    setEditIndex(null);
    setModalVisible(false);
  };

  const handleDelete = async (uid: string) => {
    const updated = members.filter(m => m.code !== uid);
    setMembers(updated);
    setModalVisible(false);
    setEditIndex(null);

    try {
      await fetch('http://846f-41-141-173-42.ngrok-free.app/delete-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid }),
      });
    } catch (error) {
      console.error("Failed to delete user from server:", error);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.5,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setNewMember((prev) => ({ ...prev, image: { uri } }));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>House Members</Text>
      <FlatList
        data={members}
        numColumns={2}
        contentContainerStyle={styles.grid}
        keyExtractor={(item, index) => item.name + index}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => {
              if (item.role === 'Owner') return;
              setEditIndex(index);
              setNewMember({
                name: item.name,
                code: item.code ?? '',
                image: item.image,
              });
              setModalVisible(true);
            }}
          >
            <View style={styles.card}>
              <Image source={item.image} style={styles.image} />
              <Text style={styles.name}>{item.name}</Text>
              <Text style={[styles.role, item.role === 'Owner' ? styles.owner : styles.member]}>
                {item.role}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.fab} onPress={() => {
        setEditIndex(null);
        setNewMember({ name: '', code: '', image: null });
        setModalVisible(true);
      }}>
        <Image source={require('../assets/icons/plus-button.png')} style={{ width: 40, height: 40 }} />
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editIndex !== null ? 'Edit Member' : 'Add Member'}</Text>
            <TextInput
              placeholder="Name"
              value={newMember.name}
              onChangeText={(text) => setNewMember({ ...newMember, name: text })}
              style={styles.input}
            />
            <TextInput
              placeholder="UID Code"
              value={newMember.code}
              onChangeText={(text) => setNewMember({ ...newMember, code: text })}
              style={styles.input}
            />
            <Button title="Choose Photo" onPress={pickImage} />
            {newMember.image && (
              <Image source={newMember.image} style={{ width: 80, height: 80, borderRadius: 40, marginTop: 10 }} />
            )}
            <View style={styles.modalButtons}>
              <Button title={editIndex !== null ? 'Save' : 'Add'} onPress={handleAdd} />
              <Button title="Cancel" onPress={() => { setModalVisible(false); setEditIndex(null); }} />
            </View>
            {editIndex !== null && (
              <Button
                title="Delete Member"
                color="red"
                onPress={() => handleDelete(members[editIndex].code)}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40, alignItems: 'center' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  grid: { alignItems: 'center' },
  card: {
    alignItems: 'center',
    margin: 15,
    padding: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 15,
    width: 140,
  },
  image: { width: 80, height: 80, borderRadius: 50, marginBottom: 10 },
  name: { fontSize: 16, fontWeight: '600' },
  role: {
    marginTop: 5,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 6,
    fontSize: 12,
    color: '#fff',
  },
  owner: { backgroundColor: '#007BFF' },
  member: { backgroundColor: '#f1c40f' },
  fab: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 40,
    padding: 10,
    elevation: 6,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#00000099',
    justifyContent: 'center',
    padding: 30,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  input: {
    borderBottomWidth: 1,
    width: '100%',
    paddingVertical: 8,
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
});
