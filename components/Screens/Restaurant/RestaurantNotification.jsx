import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RestaurantNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [restaurants, setRestaurants] = useState({});
  const [packages, setPackages] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const storedRestaurantId = await AsyncStorage.getItem('restaurantId');
      if (!token || !storedRestaurantId) {
        Alert.alert('Error', 'Token or Restaurant ID not found.');
        return;
      }

      // Fetch orders
      const ordersResponse = await axios.get('https://instaeat.azurewebsites.net/api/Order', {
        headers: {
          Authorization: `${token}`,
        },
        params: {
          minDate: '1753-01-01',
          maxDate: '9999-12-31',
        },
      });

      const ordersData = ordersResponse.data;
      const filteredNotifications = ordersData.items.filter(
        (item) => item.restaurantId === parseInt(storedRestaurantId)
      );

      // Fetch restaurant details
      const restaurantResponse = await axios.get(`https://instaeat.azurewebsites.net/api/Restaurant/${storedRestaurantId}`, {
        headers: {
          Authorization: `${token}`,
        },
      });

      const restaurantData = restaurantResponse.data;
      setRestaurants(restaurantData);

      // Fetch package details for each notification
      const packageRequests = filteredNotifications.map(async (item) => {
        const packageResponse = await axios.get(`https://instaeat.azurewebsites.net/api/Package/${item.packageId}`, {
          headers: {
            Authorization: `${token}`,
          },
        });
        return packageResponse.data;
      });

      const packagesData = await Promise.all(packageRequests);
      setPackages(packagesData);

      setNotifications(filteredNotifications);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to fetch notifications. Please try again later.');
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => {
    const packageInfo = packages.find((pkg) => pkg.packageId === item.packageId);
    return (
      <View style={styles.notificationItem}>
        <View style={styles.leftSide}>
          <Text style={styles.notificationText}>{restaurants.restaurantName} đã mua {packageInfo.packageName}</Text>
          <Text style={styles.notificationText}>{item.orderDate.toLocaleString()}</Text>
        </View>
        <View style={styles.rightSide}>
          <Text style={styles.notificationColor}>{packageInfo.price}VNĐ</Text>
          <Text style={styles.notificationColor}>+ {packageInfo.point} điểm</Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="purple" />
            </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Thông Báo:</Text>
      </View>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.orderId.toString()}
        renderItem={renderItem}
      />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
    paddingTop: 30,
    backgroundColor: 'purple',
  },
  headerText: {
    padding: 20,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  notificationItem: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 5,
  },
  leftSide: {
    flex: 1,
  },
  rightSide: {
    flex: 1,
    alignItems: 'flex-end',
  },
  notificationText: {
    fontSize: 16,
    marginBottom: 5,
  },
  notificationColor: {
    fontSize: 16,
    marginBottom: 5,
    color:'green',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
},
});

export default RestaurantNotification;
