import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Entypo } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
const ShopPointScreen = ({navigation}) => {
  const [token, setToken] = useState(null);
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    // Function to retrieve token from AsyncStorage
    const getToken = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        setToken(userToken);
        console.log('Token:', userToken);
      } catch (error) {
        console.error('Error retrieving token from AsyncStorage:', error);
      }
    };
  
    getToken(); // Call the function to get token
  
    // Function to fetch package data
    const fetchPackages = async () => {
      try {
        const response = await axios.get('https://instaeat.azurewebsites.net/api/Package', {
          headers: {
            Authorization: `${token}`, // Ensure Bearer is prepended to the token
          },
        });
        setPackages(response.data.items); // Assuming response contains an array of packages
      } catch (error) {
        console.error('Error fetching packages:', error);
      }
    };
  
    if (token) {
      fetchPackages(); // Call the function to fetch packages if token is available
    }
  }, [token]); // Dependency array to run effect only when token changes
  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
        <MaterialIcons name="keyboard-arrow-left" size={24} color="white" />
          <Text style={styles.headerText}>Túi điểm của cửa hàng</Text>
          </TouchableOpacity>
          <Text style={styles.pointsValue}>Điểm hiện có: 0</Text>
        </View>
      </View>
      <FlatList
        data={packages}
        keyExtractor={(item) => item.packageId.toString()}
        renderItem={({ item }) => (
          <View style={styles.packageItem}>
            <View style={styles.packageInfo}>
              <Text style={styles.packagePoints}>{item.packageName}</Text>
              <Text style={styles.packagePrice}>Giá: {item.price} VNĐ</Text>
              <Text style={styles.packagePointPrice}>Điểm:<Text>{item.point} Point</Text></Text>
            </View>
            <TouchableOpacity>
            <Entypo name="shopping-cart" size={24} color="orange" />
            </TouchableOpacity>
          </View>
        )}
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
    paddingBottom:10,
  },
  headerContent: {
    alignItems: 'flex-start',
  },
  pointsValue: {
    paddingLeft: 20,
    fontSize: 16,
    color: 'white',
  },
  headerText: {
    padding: 20,
    paddingLeft:0,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  packageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginTop:10,
  },
  packageInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  packagePoints: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  packagePrice: {
    fontSize: 14,
  },
  packagePointPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  back:{
    flexDirection:'row',
    alignItems: 'center',
  }
});

export default ShopPointScreen;
