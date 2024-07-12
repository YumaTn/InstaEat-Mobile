import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { FontAwesome5, AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const RestaurantHome = ({ navigation }) => {
  const [restaurantDetails, setRestaurantDetails] = useState({
    restaurantName: '',
    openTime: '',
    closeTime: '',
    address: '',
  });
  const [reviewData, setReviewData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imageCount, setImageCount] = useState(0); 
  const [contentCount, setContentCount] = useState(0); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        
        if (!token) {
          throw new Error('User token not found');
        }

        // Fetch restaurant details
        const restaurantResponse = await axios.get(`https://instaeat.azurewebsites.net/api/Restaurant`, {
          headers: {
            Authorization: `${token}`,
          },
        });
        const fetchedRestaurant = restaurantResponse.data.items[0]; 
        setRestaurantDetails(fetchedRestaurant);

        // Fetch reviews based on restaurantId and status
        const reviewsResponse = await axios.get(`https://instaeat.azurewebsites.net/api/Review/restaurant?status=1`, {
          headers: {
            Authorization: `${token}`,
          },
        });

        if (reviewsResponse.status === 200) {
          // Filter reviews based on restaurantId (replace with correct restaurantId logic)
          const filteredReviews = reviewsResponse.data.items.filter(review => review.restaurantId === fetchedRestaurant.restaurantId);
          setReviewData(filteredReviews);

          // Count images and content
          let imageCount = 0;
          let contentCount = 0;

          filteredReviews.forEach(review => {
            if (review.image) {
              imageCount++;
            }
            if (review.content) {
              contentCount++;
            }
          });

          setImageCount(imageCount);
          setContentCount(contentCount);

          // Extract customerId from the first review (assuming it's available)
          const customerId = filteredReviews.length > 0 ? filteredReviews[0].customerId : null;

          // Fetch username from Account API if customerId matches userId
          if (customerId) {
            const accountResponse = await axios.get(`https://instaeat.azurewebsites.net/api/Account/${customerId}`, {
              headers: {
                Authorization: `${token}`,
              },
            });
            if (accountResponse.status === 200) {
              const username = accountResponse.data.username;
              console.log('Username:', username);
            } else {
              throw new Error('Failed to fetch username');
            }
          }
        } else {
          throw new Error('Failed to fetch review data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        Alert.alert('Error', 'Failed to fetch data. Please try again.');
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Polling every 10 seconds
    const interval = setInterval(fetchData, 10000);

    return () => clearInterval(interval);
  }, []);

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
      <View style={styles.headerContainer}>
        <Text style={styles.header}>{restaurantDetails.restaurantName}</Text>
        <View style={styles.funcContainer}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('RAccept')}>
            <AntDesign name="notification" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('ShopPoint')}>
            <FontAwesome5 name="coins" size={22} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView>
        <Image style={styles.image} source={require('../../../assets/images/background.jpg')} />
        <Text style={styles.titleRestaurant}>{restaurantDetails.restaurantName}</Text>

        <View style={styles.info}>
          <View style={styles.detailInfo}>
            <Text style={styles.numberCount}>{imageCount}</Text>
            <Text>Hình Ảnh</Text>
          </View>
          <View style={styles.detailInfo}>
            <Text style={styles.numberCount}>{contentCount}</Text>
            <Text>Bình luận</Text>
          </View>
        </View>
        <View style={styles.openAndOff}>
          <Text style={styles.openAndOffTitle}>Mở cửa:</Text>
          <Text style={styles.openAndOffClock}>
            {restaurantDetails.openTime} - {restaurantDetails.closeTime}
          </Text>
          <Text><Text style={styles.address}>Địa chỉ:</Text>{restaurantDetails.address}</Text>
        </View>
        <View style={styles.empty}></View>
        <View>
          <Text style={styles.customer}>Bình Luận:</Text>
          {reviewData.map((item, index) => (
            <View key={index} style={styles.reviewContainer}>
              <TouchableOpacity>
                <Text style={styles.content}>{item.content}</Text>
                {item.image && <Image source={{ uri: item.image }} style={styles.reviewImage} />}
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: 'purple',
  },
  header: {
    fontSize: 20,
    color: 'white',
    flex: 1,
  },
  funcContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 20,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  titleRestaurant: {
    fontSize: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    fontWeight: 'bold',
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  detailInfo: {
    alignItems: 'center',
  },
  numberCount: {
    fontWeight: 'bold',
  },
  openAndOff: {
    padding: 15,
  },
  openAndOffTitle: {
    color: 'green',
    fontSize: 15,
    fontWeight: 'bold',
  },
  openAndOffClock: {
    color: 'gray',
  },
  empty: {
    height: 10,
    backgroundColor: '#CCCCCC',
  },
  address: {
    paddingTop: 10,
    fontWeight: 'bold',
  },
  customer: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 10,
  },
  reviewContainer: {
    marginVertical: 10,
  },
  content: {
    fontSize: 16,
    marginBottom: 2,
  },
  reviewImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
},
});

export default RestaurantHome;
