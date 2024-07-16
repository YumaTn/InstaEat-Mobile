import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons';

const EditRestaurant = ({navigation}) => {
  const [restaurantId, setRestaurantId] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const [address, setAddress] = useState('');
  const [openTime, setOpenTime] = useState('');
  const [closeTime, setCloseTime] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        // Get token from AsyncStorage
        const storedToken = await AsyncStorage.getItem('userToken');
        if (!storedToken) {
          throw new Error('Token not found in AsyncStorage');
        }
        setToken(storedToken);
        
        // Get restaurantId from AsyncStorage
        const storedRestaurantId = await AsyncStorage.getItem('restaurantId');
        if (!storedRestaurantId) {
          throw new Error('Restaurant ID not found in AsyncStorage');
        }
        setRestaurantId(storedRestaurantId);

        // Fetch restaurant details from API using restaurantId and token
        const response = await axios.get(`https://instaeat.azurewebsites.net/api/Restaurant/${storedRestaurantId}`, {
          headers: {
            Authorization: `${storedToken}`,
          },
        });
        const { restaurantName, address, openTime, closeTime } = response.data;

        setRestaurantName(restaurantName);
        setAddress(address);
        setOpenTime(openTime);
        setCloseTime(closeTime);
      } catch (error) {
        console.error('Error fetching restaurant data:', error);
        Alert.alert('Error', 'Failed to fetch restaurant data. Please try again.');
      }
    };

    fetchRestaurantData();
  }, []);

  const handleSave = async () => {
    try {
      // Prepare payload for updating restaurant details
      const payload = {
        restaurantName: restaurantName,
        address: address,
        openTime: openTime,
        closeTime: closeTime,
      };

      // Send updated data to API using restaurantId and token
      const response = await axios.put(`https://instaeat.azurewebsites.net/api/Restaurant/${restaurantId}`, payload, {
        headers: {
          Authorization: `${token}`,
        },
      });

      if (response.status === 200) {
        Alert.alert('Success', 'Restaurant information updated successfully.', [
            {
              text: 'OK',
              onPress: () => navigation.goBack(), // Navigate back after successful update
            },
          ]);
      } else {
        throw new Error('Failed to update restaurant information');
      }
    } catch (error) {
      console.error('Error updating restaurant information:', error);
      Alert.alert('Error', 'Failed to update restaurant information. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backContainer} onPress={() => navigation.goBack()}>
          <MaterialIcons name="keyboard-arrow-left" size={24} color="white" />
          <Text style={styles.headerText}>Chỉnh sửa thông tin nhà hàng</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Restaurant Name"
          value={restaurantName}
          onChangeText={setRestaurantName}
        />
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder="Address"
          value={address}
          onChangeText={setAddress}
          multiline={true}
          numberOfLines={4} 
        />
        <TextInput
          style={styles.input}
          placeholder="Open Time (e.g., 07:00)"
          value={openTime}
          onChangeText={setOpenTime}
        />
        <TextInput
          style={styles.input}
          placeholder="Close Time (e.g., 07:00)"
          value={closeTime}
          onChangeText={setCloseTime}
        />
        <TouchableOpacity style={styles.password} onPress={() => navigation.navigate('Password')}>
            <Text>Đổi mật khẩu</Text>
            <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleSave} > 
            <Text style={{color:'white',textAlign:'center'}}>Xác nhận</Text>
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
    marginBottom:10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 5,
  },
  formContainer: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  multilineInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  backContainer: {
    flexDirection: 'row',
  },
  button: {
    borderWidth: 1,
    borderColor: 'orange',
    padding: 12,
    borderRadius: 10,
    backgroundColor: 'orange',
    marginLeft:160,
    marginRight:160,
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

export default EditRestaurant;
