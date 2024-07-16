import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Button, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const EditUser = ({ navigation }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [roleId, setRoleId] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get token from AsyncStorage
        const userToken = await AsyncStorage.getItem('userToken');
        if (!userToken) {
          throw new Error('User token not found in AsyncStorage');
        }
        setToken(userToken);

        // Get userId from AsyncStorage
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) {
          throw new Error('User ID not found in AsyncStorage');
        }

        // Get password and roleId from AsyncStorage
        const storedPassword = await AsyncStorage.getItem('password');
        const storedRoleId = await AsyncStorage.getItem('roleId');
        if (!storedPassword) {
          throw new Error('Password not found in AsyncStorage');
        }
        if (!storedRoleId) {
          throw new Error('Role ID not found in AsyncStorage');
        }
        setPassword(storedPassword);
        setRoleId(storedRoleId);

        // Fetch user data from the API
        const response = await axios.get(`https://instaeat.azurewebsites.net/api/Account/${userId}`, {
          headers: {
            Authorization: `${userToken}`,
          },
        });

        // Populate the state with the fetched data
        if (response.status === 200) {
          const userData = response.data;
          setName(userData.name);
          setPhone(userData.phone);
        } else {
          throw new Error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'Failed to fetch user data. Please try again.');
      }
    };

    fetchUserData();
  }, []);

  const handleSave = async () => {
    try {
      // Get userId from AsyncStorage
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        throw new Error('User ID not found in AsyncStorage');
      }

      // Prepare the payload
      const payload = {
        name,
        phone,
        password,
        roleId: parseInt(roleId),
      };

      // Send the updated data to the API
      const response = await axios.put(`https://instaeat.azurewebsites.net/api/Account/${userId}`, payload, {
        headers: {
          Authorization: `${token}`,
        },
      });

      if (response.status === 200) {
        Alert.alert('Success', 'User data updated successfully.');
        navigation.goBack();
      } else {
        throw new Error('Failed to update user data');
      }
    } catch (error) {
      console.error('Error updating user data:', error);
      Alert.alert('Error', 'Failed to update user data. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backContainer} onPress={() => navigation.goBack()}>
          <MaterialIcons name="keyboard-arrow-left" size={24} color="white" />
          <Text style={styles.headerText}>Chỉnh sửa</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <TouchableOpacity style={styles.password} onPress={() => navigation.navigate('Password')}>
            <Text>Đổi mật khẩu</Text>
            <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
        </TouchableOpacity>
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
  password:{
    borderTopWidth:1,
    borderBottomWidth:1,
    padding:10,
    marginTop:20,
    marginBottom:20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-between',
    borderColor:'#CCCCCC'
  }
});

export default EditUser;
