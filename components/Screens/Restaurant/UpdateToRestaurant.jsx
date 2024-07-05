import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { SimpleLineIcons } from '@expo/vector-icons';

const UpdateToRestaurant = () => {
  const [restaurantName, setRestaurantName] = useState('');
  const [address, setAddress] = useState('');
  const [openTime, setOpenTime] = useState('');
  const [closeTime, setCloseTime] = useState('');
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState(null); // State to store userId from AsyncStorage
  const navigation = useNavigation();

  useEffect(() => {
    const getTokenAndUserId = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        if (userToken) {
          setToken(userToken);
          const storedUserId = await AsyncStorage.getItem('userId');
          if (storedUserId) {
            setUserId(storedUserId);
          } else {
            Alert.alert('Error', 'User ID not found in storage');
          }
        } else {
          Alert.alert('Error', 'Token not found');
        }
      } catch (error) {
        console.error('Error retrieving token or user ID:', error);
        Alert.alert('Error', 'Failed to retrieve token or user ID');
      }
    };

    getTokenAndUserId();
  }, []);

  const handleSubmit = async () => {
    try {
      if (!userId) {
        Alert.alert('Error', 'User ID is not available');
        return;
      }
      const updateResponse = await axios.post(
        'https://instaeat.azurewebsites.net/api/Account/register/restaurant',
        {
          userId, // Use the retrieved userId from AsyncStorage
          restaurant: {
            restaurantName,
            address,
            openTime,
            closeTime,
          },
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      console.log('Update response:', updateResponse.data);
      Alert.alert('Success', 'Restaurant information updated successfully', [
        { text: 'OK', onPress: () => navigation.navigate('Login') } // Navigate to Login screen after success
      ]);
    } catch (error) {
      console.error('Error updating restaurant:', error);
      if (error.response && error.response.status === 405) {
        Alert.alert('Error', 'Method Not Allowed. Please check the API documentation for the correct HTTP method.');
      } else {
        Alert.alert('Error', 'Failed to update restaurant. Please try again.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <SimpleLineIcons name="arrow-left" size={24} color="white" />
      </TouchableOpacity>
      <Text style={styles.title}>Update Restaurant Information</Text>
      <TextInput
        style={styles.input}
        placeholder="Restaurant Name"
        value={restaurantName}
        onChangeText={setRestaurantName}
        placeholderTextColor="#CCCCCC"
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
        placeholderTextColor="#CCCCCC"
      />
      <TextInput
        style={styles.input}
        placeholder="Opening Time"
        value={openTime}
        onChangeText={setOpenTime}
        placeholderTextColor="#CCCCCC"
      />
      <TextInput
        style={styles.input}
        placeholder="Closing Time"
        value={closeTime}
        onChangeText={setCloseTime}
        placeholderTextColor="#CCCCCC"
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text>Xác nhận</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'purple',
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    width: '100%',
    backgroundColor: 'white',
    marginTop: 10,
  },
  button: {
    borderWidth: 1,
    borderColor: 'orange',
    backgroundColor: 'white',
    padding: 12,
    marginTop: 20,
    borderRadius: 10,
    backgroundColor: 'orange',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 10,
  },
});

export default UpdateToRestaurant;
