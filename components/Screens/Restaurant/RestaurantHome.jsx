import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator, Modal } from 'react-native';
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
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [pendingReviewsCount, setPendingReviewsCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const restaurantId = await AsyncStorage.getItem('restaurantId');

        if (!token || !restaurantId) {
          throw new Error('User token or Restaurant ID not found');
        }

        // Fetch restaurant details
        const restaurantResponse = await axios.get(`https://instaeat.azurewebsites.net/api/Restaurant/${restaurantId}`, {
          headers: {
            Authorization: `${token}`,
          },
        });
        const fetchedRestaurant = restaurantResponse.data;
        setRestaurantDetails(fetchedRestaurant);

        // Fetch reviews based on restaurantId and status
        const reviewsResponse = await axios.get(`https://instaeat.azurewebsites.net/api/Review/restaurant?status=1`, {
          headers: {
            Authorization: `${token}`,
          },
        });

        if (reviewsResponse.status === 200) {
          // Filter reviews based on restaurantId
          const filteredReviews = reviewsResponse.data.items.filter(
            review => review.restaurantId === fetchedRestaurant.restaurantId
          );

          // Get names for each review
          const reviewWithNames = await Promise.all(
            filteredReviews.map(async review => {
              const accountResponse = await axios.get(
                `https://instaeat.azurewebsites.net/api/Account/${review.customerId}`,
                {
                  headers: {
                    Authorization: `${token}`,
                  },
                }
              );
              const name = accountResponse.data.name;
              return { ...review, name };
            })
          );

          setReviewData(reviewWithNames);

          // Count images and content
          let imageCount = 0;
          let contentCount = 0;

          reviewWithNames.forEach(review => {
            if (review.image) {
              imageCount++;
            }
            if (review.content) {
              contentCount++;
            }
          });

          setImageCount(imageCount);
          setContentCount(contentCount);

          const pendingReviewsResponse = await axios.get(`https://instaeat.azurewebsites.net/api/Review/restaurant?status=0`, {
            headers: {
              Authorization: `${token}`,
            },
          });
          if (pendingReviewsResponse.status === 200) {
            const pendingReviewsCount = pendingReviewsResponse.data.items.filter(
              review => review.restaurantId === fetchedRestaurant.restaurantId
            ).length;
            setPendingReviewsCount(pendingReviewsCount);
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

  useEffect(() => {
    const checkAndDeleteOldReviews = async () => {
      try {
        // Get current timestamp
        const currentTimestamp = Date.now();

        // Iterate through reviewData and delete reviews older than 7 days
        const updatedReviewData = reviewData.filter(review => {
          // Calculate difference in milliseconds
          const reviewTimestamp = Date.parse(review.createdAt); // Replace with your review creation time
          const difference = currentTimestamp - reviewTimestamp;

          // Convert milliseconds to days
          const daysDifference = difference / (1000 * 3600 * 24);

          // If review is less than 7 days old, keep it
          return daysDifference <= 7;
        });

        setReviewData(updatedReviewData);
      } catch (error) {
        console.error('Error checking and deleting old reviews:', error);
      }
    };

    // Run checkAndDeleteOldReviews every 7 days (7 * 24 * 60 * 60 * 1000 milliseconds)
    const reviewCleanupInterval = setInterval(checkAndDeleteOldReviews, 7 * 24 * 60 * 60 * 1000);

    return () => clearInterval(reviewCleanupInterval);
  }, [reviewData]);

  const openModal = (image) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setModalVisible(false);
  };

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
      <View style={styles.headerContainer}>
        <Text style={styles.header}>{restaurantDetails.restaurantName}</Text>
        <View style={styles.funcContainer}>
          {pendingReviewsCount > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationText}>{pendingReviewsCount}</Text>
            </View>
          )}
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
          <Text>
            <Text style={styles.address}>Địa chỉ:</Text>
            {restaurantDetails.address}
          </Text>
        </View>
        <View style={styles.empty}></View>
        <View>
          <Text style={styles.customer}>{contentCount} bình Luận</Text>
          {reviewData.map((item, index) => (
            <View key={index} style={styles.reviewContainer}>
              <View>
                <Text style={styles.customerId}>{item.name}:</Text>
                <Text style={styles.content}>{item.content}</Text>
                {item.image && (
                  <TouchableOpacity onPress={() => openModal(item.image)}>
                    <Image source={{ uri: item.image }} style={styles.reviewImage} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {selectedImage && (
        <Modal visible={modalVisible} transparent={true} animationType="fade" onRequestClose={closeModal}>
          <TouchableOpacity style={styles.modalContainer} onPress={closeModal}>
            <Image source={{ uri: selectedImage }} style={styles.modalImage} />
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingBottom:100,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#ef4d2d',
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
  },
  titleRestaurant: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth:1,
    borderTopColor:'#CCCCCC',
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
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
  address: {
    fontWeight: 'bold',
    color: '#666',
  },
  empty: {
    backgroundColor: '#CCCCCC',
    height: 8,
    marginTop: 15,
  },
  customer: {
    padding: 15,
    paddingLeft: 20,
    fontSize: 16,
    fontWeight:'bold'
  },
  customerId: {
    fontWeight: 'bold',
  },
  content: {
    paddingBottom: 10,
  },
  reviewContainer: {
    padding: 10,
    marginBottom: 10,
    borderTopWidth:1,
    borderColor:'#CCCCCC'
  },
  reviewImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: '90%',
    height: '90%',
    resizeMode: 'contain',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'white'
  },
  notificationBadge: {
    position: 'absolute',
    top: -10,
    right: 30,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  notificationText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default RestaurantHome;
