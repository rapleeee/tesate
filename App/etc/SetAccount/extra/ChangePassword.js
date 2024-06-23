import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { auth } from '../../../../firebase'; // Pastikan jalur ke file firebase.js benar
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const togglePasswordVisibility = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const reauthenticate = async (currentPassword) => {
    try {
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
    } catch (error) {
      throw error; // Propagate error if reauthentication fails
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      Alert.alert('Error', 'New passwords do not match.');
      return;
    }

    try {
      await reauthenticate(currentPassword);
      const user = auth.currentUser;
      await updatePassword(user, newPassword);
      Alert.alert('Success', 'Password has been changed.');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Change Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Current Password"
        value={currentPassword}
        secureTextEntry={secureTextEntry}
        onChangeText={(text) => setCurrentPassword(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="New Password"
        value={newPassword}
        secureTextEntry={secureTextEntry}
        onChangeText={(text) => setNewPassword(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm New Password"
        value={confirmNewPassword}
        secureTextEntry={secureTextEntry}
        onChangeText={(text) => setConfirmNewPassword(text)}
      />
      <TouchableOpacity onPress={togglePasswordVisibility} style={styles.icon}>
        <Ionicons
          name={secureTextEntry ? 'eye-off' : 'eye'}
          size={24}
          color="grey"
        />
      </TouchableOpacity>
      <Button title="Change Password" onPress={handleChangePassword} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  icon: {
    alignSelf: 'flex-end',
    marginRight: 16,
    marginBottom: 12,
  },
});
