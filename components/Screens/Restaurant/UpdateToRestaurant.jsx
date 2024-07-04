import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';

const UpdateToRestaurant = () => {
  const [restaurantName, setRestaurantName] = useState('');
  const [address, setAddress] = useState('');
  const [openTime, setOpenTime] = useState('');
  const [closeTime, setCloseTime] = useState('');
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoidGVzdHJlc3RhdXJhbnQiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiIyIiwiZXhwIjoxNzIwMTY1MzIzfQ.Lu1evZBX3s9B8eCEtHTKWuL5oSq43h7Au-RbUIT_J40";

  // Function to handle form submission
  const handleSubmit = async () => {
    try {
      // Update restaurant information using retrieved token
      const updateResponse = await axios.put(
        'https://instaeat.azurewebsites.net/api/Account/register/restaurant',
        {
          userId: 0, // Replace with actual userId
          restaurant: {
            restaurantName,
            address,
            openTime,
            closeTime,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Update response:', updateResponse.data);
      // Handle success or update UI accordingly
    } catch (error) {
      console.error('Error updating restaurant:', error);
      // Handle error, show message, etc.
    }
  };

  return (
    <View style={styles.container}>
      <Text>Update Restaurant Information</Text>
      <TextInput
        style={styles.input}
        placeholder="Restaurant Name"
        value={restaurantName}
        onChangeText={setRestaurantName}
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />
      <TextInput
        style={styles.input}
        placeholder="Opening Time"
        value={openTime}
        onChangeText={setOpenTime}
      />
      <TextInput
        style={styles.input}
        placeholder="Closing Time"
        value={closeTime}
        onChangeText={setCloseTime}
      />
      <Button title="Update" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    width: '100%',
  },
});

export default UpdateToRestaurant;
