import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';

const RestaurantProfile = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [restaurantData, setRestaurantData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = {
        username: await AsyncStorage.getItem('username'),
        password: await AsyncStorage.getItem('password'),
        name: await AsyncStorage.getItem('name'),
        phone: await AsyncStorage.getItem('phone'),
        userId: await AsyncStorage.getItem('userId'),
        roleId: await AsyncStorage.getItem('roleId')
      };
      setUserData(user);
    };

    const fetchRestaurantData = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const restaurantId = await AsyncStorage.getItem('restaurantId');
        if (!token) {
          throw new Error('User token not found');
        }
        const response = await axios.get(`https://instaeat.azurewebsites.net/api/Restaurant/${restaurantId}`, {
          headers: {
            Authorization: `${token}`,
          },
        });

        setRestaurantData(response.data);
      } catch (error) {
        console.error('Error fetching restaurant details:', error);
        Alert.alert('Error', 'Failed to fetch restaurant details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = navigation.addListener('focus', () => {
      setLoading(true);
      fetchUserData();
      fetchRestaurantData();
    });

    return unsubscribe;
  }, [navigation]);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('username');
      await AsyncStorage.removeItem('password');
      await AsyncStorage.removeItem('name');
      await AsyncStorage.removeItem('phone');
      await AsyncStorage.removeItem('userId');
      await AsyncStorage.removeItem('roleId');
      await AsyncStorage.removeItem('restaurantId');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ef4d2d" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>{restaurantData ? restaurantData.restaurantName : 'N/A'}</Text>
      </View>
      {restaurantData && (
        <>
          <View style={styles.sectionEdit}>
            <Text style={styles.sectionHeader}>Thông tin nhà hàng:</Text>
            <TouchableOpacity style={styles.edit} onPress={() => navigation.navigate('EditRestaurant')}>
              <MaterialIcons name="edit" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userInfo}>Tên nhà hàng: {restaurantData.restaurantName}</Text>
          <Text style={styles.userInfo}>Địa chỉ: {restaurantData.address}</Text>
          <Text style={styles.userInfo}>Giờ mở cửa: {restaurantData.openTime}</Text>
          <Text style={styles.userInfo}>Giờ đóng cửa: {restaurantData.closeTime}</Text>
        </>
      )}

      <TouchableOpacity onPress={() => navigation.navigate('Wallet')}>
        <View style={styles.wallet}>
          <Text style={styles.walletTitle}>Wallet</Text>
          <MaterialIcons name="keyboard-arrow-right" size={24} color="black" justifyContent='flex-end' />
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  userInfo: {
    fontSize: 16,
    marginBottom: 10,
  },
  logoutButton: {
    marginTop: 30,
    backgroundColor: '#ef4d2d',
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
  },
  restaurant: {
    cursor: 'pointer',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    padding: 16,
    paddingBottom:22,
    backgroundColor: '#ef4d2d',
    justifyContent: 'space-between',
    width: '100%',
  },
  titleText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  restaurantText: {
    color: 'white',
  },
  wallet: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    padding: 15,
    marginTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  walletTitle: {
    fontSize: 15,
  },
  sectionEdit:{
    flexDirection: 'row',
    alignItems: 'center',
     justifyContent:'space-between'
  },
  edit:{
    top:5,
    marginRight:7,
  },
});

export default RestaurantProfile;
