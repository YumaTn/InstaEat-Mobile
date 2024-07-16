import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Button, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Password = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token, setToken] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [roleId, setRoleId] = useState('');
  const [userId, setUserId] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get token from AsyncStorage
        const userToken = await AsyncStorage.getItem('userToken');
        if (!userToken) {
          throw new Error('User token not found in AsyncStorage');
        }
        setToken(userToken);

        // Get user details from AsyncStorage
        const storedName = await AsyncStorage.getItem('name');
        const storedPhone = await AsyncStorage.getItem('phone');
        const storedRoleId = await AsyncStorage.getItem('roleId');
        const storedUserId = await AsyncStorage.getItem('userId');
        const storedUsername = await AsyncStorage.getItem('username');

        if (!storedName || !storedPhone || !storedRoleId || !storedUserId || !storedUsername) {
          throw new Error('User details not found in AsyncStorage');
        }

        setName(storedName);
        setPhone(storedPhone);
        setRoleId(storedRoleId);
        setUserId(storedUserId);
        setUsername(storedUsername);
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'Failed to fetch user data. Please try again.');
      }
    };

    fetchUserData();
  }, []);

  const handleSave = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match. Please try again.');
      return;
    }

    try {
      // Verify current password by making a login request
      const verifyPayload = {
        userName: username, // Use username obtained from AsyncStorage
        password: currentPassword,
      };

      const verifyResponse = await axios.post(`https://instaeat.azurewebsites.net/api/Account/login`, verifyPayload);

      if (verifyResponse.status === 200) {
        // Prepare the payload for updating the password
        const payload = {
          name: name,
          password: newPassword,
          roleId: parseInt(roleId),
          phone: phone,
        };

        // Send the updated data to the API using userId from AsyncStorage
        const response = await axios.put(`https://instaeat.azurewebsites.net/api/Account/${userId}`, payload, {
          headers: {
            Authorization: `${token}`,
          },
        });

        if (response.status === 200) {
          Alert.alert('Success', 'Password updated successfully.');
          navigation.goBack();
        } else {
          throw new Error('Failed to update password');
        }
      } else {
        Alert.alert('Error', 'Current password is incorrect.');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      Alert.alert('Error', 'Failed to update password. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backContainer} onPress={() => navigation.goBack()}>
          <MaterialIcons name="keyboard-arrow-left" size={24} color="white" />
          <Text style={styles.headerText}>Đổi mật khẩu</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu hiện tại"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry
          placeholderTextColor="#CCCCCC"
        />
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu mới"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          placeholderTextColor="#CCCCCC"
        />
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu cũ"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          placeholderTextColor="#CCCCCC"
        />
        <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={{color:'white'}}>Xác nhận</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 61,
    paddingBottom: 10,
    paddingLeft: 10,
    backgroundColor: '#ef4d2d',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 5,
  },
  backContainer: {
    flexDirection: 'row',
  },
  formContainer: {
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  button: {
    borderWidth: 1,
    borderColor: 'orange',
    padding: 12,
    borderRadius: 10,
    backgroundColor: 'orange',
    marginLeft:144,
    marginRight:144,
  },
});

export default Password;
