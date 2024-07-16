import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Notification = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [restaurantDetails, setRestaurantDetails] = useState({});
  const [userDetails, setUserDetails] = useState({});

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const userId = await AsyncStorage.getItem('userId');
        
        if (!token || !userId) {
          throw new Error('User token or User ID not found');
        }

        const response = await axios.get('https://instaeat.azurewebsites.net/api/Transaction', {
          params: {
            minDate: '1753-01-01',
            maxDate: '9999-12-31',
            pageSize:100,
          },
          headers: {
            Authorization: `${token}`,
          },
        });

        if (response.data && response.data.items) {
          const filteredTransactions = response.data.items.filter(item => item.userId === parseInt(userId));
          setTransactions(filteredTransactions);
          setLoading(false);
        } else {
          throw new Error('Empty response or missing items array');
        }
        
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setError('Failed to fetch transactions. Please try again.');
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const userId = await AsyncStorage.getItem('userId');
        
        if (!token || !userId) {
          throw new Error('User token or User ID not found');
        }

        const response = await axios.get(`https://instaeat.azurewebsites.net/api/Account/${userId}`, {
          headers: {
            Authorization: `${token}`,
          },
        });

        if (response.data) {
          setUserDetails(response.data);
        } else {
          throw new Error(`Failed to fetch user details for userId: ${userId}`);
        }
        
      } catch (error) {
        console.error('Error fetching user details:', error);
        setError('Failed to fetch user details. Please try again.');
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const userId = await AsyncStorage.getItem('userId');
        
        if (!token || !userId) {
          throw new Error('User token or User ID not found');
        }

        transactions.forEach(async (transaction) => {
          const response = await axios.get(`https://instaeat.azurewebsites.net/api/Restaurant/${transaction.restaurantId}`, {
            headers: {
              Authorization: `${token}`,
            },
          });

          if (response.data) {
            const restaurantInfo = response.data;
            setRestaurantDetails(prevState => ({
              ...prevState,
              [transaction.restaurantId]: restaurantInfo.restaurantName,
            }));
          } else {
            throw new Error(`Failed to fetch restaurant details for restaurantId: ${transaction.restaurantId}`);
          }
        });
        
      } catch (error) {
        console.error('Error fetching restaurant details:', error);
        setError('Failed to fetch restaurant details. Please try again.');
      }
    };

    fetchRestaurantDetails();
  }, [transactions]);

  const renderItem = ({ item }) => (
    <View style={styles.notificationItem}>
      <Text style={styles.notificationText}>Bạn đã nhận được {item.amount} point của nhà hàng {restaurantDetails[item.restaurantId]}</Text>
      <Text style={[styles.notificationText, styles.amountText]}>+ {item.amount} point</Text>
      <Text style={styles.notificationText}>{new Date(item.created).toLocaleString()}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#ef4d2d" />
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
        data={transactions}
        keyExtractor={(item) => item.transactionId.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
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
    backgroundColor: '#ef4d2d',
  },
  headerText: {
    padding: 20,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  notificationItem: {
    backgroundColor: 'white',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 5,
  },
  notificationText: {
    fontSize: 16,
  },
  amountText: {
    textAlign: 'right',
    width: '100%',
    color:'green'
  },
  listContainer: {
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
},
});

export default Notification;
