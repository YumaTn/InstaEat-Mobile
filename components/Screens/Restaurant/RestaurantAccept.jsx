import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, Image, FlatList, Modal, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons';

const RestaurantAccept = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [reviewData, setReviewData] = useState([]);
  const [token, setToken] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    const fetchReviewData = async () => {
      try {
        // Get token from AsyncStorage
        const userToken = await AsyncStorage.getItem('userToken');
        if (!userToken) {
          throw new Error('User token not found in AsyncStorage');
        }
        setToken(userToken);

        // Get restaurantId from AsyncStorage
        const restaurantId = await AsyncStorage.getItem('restaurantId');
        if (!restaurantId) {
          throw new Error('Restaurant ID not found in AsyncStorage');
        }

        // Fetch review data for the restaurant
        const response = await axios.get(`https://instaeat.azurewebsites.net/api/Review/restaurant`, {
          headers: {
            Authorization: `${userToken}`,
          },
        });

        // Handle response
        if (response.status === 200) {
          // Filter reviews based on restaurantId
          const filteredReviews = response.data.items.filter(review => review.restaurantId === parseInt(restaurantId));

          // Fetch user names for each review
          const reviewWithNames = await Promise.all(
            filteredReviews.map(async review => {
              const accountResponse = await axios.get(
                `https://instaeat.azurewebsites.net/api/Account/${review.customerId}`,
                {
                  headers: {
                    Authorization: `${userToken}`,
                  },
                }
              );
              const name = accountResponse.data.name;
              return { ...review, name };
            })
          );

          setReviewData(reviewWithNames);
        } else {
          throw new Error('Failed to fetch review data');
        }
      } catch (error) {
        console.error('Error fetching review data:', error);
        Alert.alert('Error', 'Failed to fetch review data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchReviewData();
  }, []);

  // Show loading indicator while fetching data
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ef4d2d" />
      </View>
    );
  }

  // Show error message if review data is not available
  if (!reviewData || reviewData.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.backContainer} onPress={() => navigation.goBack()}>
            <MaterialIcons name="keyboard-arrow-left" size={24} color="white" />
            <Text style={styles.headerTitle}>Duyệt Review</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.review}>Không có review</Text>
      </View>
    );
  }

  // Open modal with selected image
  const openImageModal = (imageUri) => {
    setSelectedImage(imageUri);
    setModalVisible(true);
  };

  // Close modal
  const closeModal = () => {
    setSelectedImage('');
    setModalVisible(false);
  };

  // Delete review function
  const rejectReview = async (reviewId) => {
    try {
      // Call API to delete the review with reviewId
      const response = await axios.delete(`https://instaeat.azurewebsites.net/api/Review/restaurant/${reviewId}`, {
        headers: {
          Authorization: token,
        },
      });

      // Check if deletion was successful
      if (response.status === 200) {
        const updatedReviews = reviewData.filter(review => review.reviewId !== reviewId);
        setReviewData(updatedReviews);
      } else {
        throw new Error('Failed to delete review');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      Alert.alert('Error', 'Failed to delete review. Please try again.');
    }
  };

  const acceptReview = async (reviewId) => {
  try {
    // Send request to API to accept the review with reviewId
    const response = await axios.post(
      `https://instaeat.azurewebsites.net/api/Review/accept/${reviewId}`,
      {},
      {
        headers: {
          Authorization: token,
        },
      }
    );
    // Check if acceptance was successful (status === 200)
    if (response.status === 200) {
      Alert.alert('Success', 'Đã chuyển 5 điểm cho review này.');
      const updatedReviews = reviewData.filter(review => review.reviewId !== reviewId);
      setReviewData(updatedReviews);
    } else {
      Alert.alert('Thất bại', 'Không đủ điểm để chuyển cho Review này.');
      throw new Error('Failed to Accept review');
    }
  } catch (error) {
    console.error('Error Accepting review:', error);
    Alert.alert('Error', 'Failed to Accept review. Please try again.');
  }
};

  
  const renderReviewItem = ({ item }) => (
    <View style={styles.reviewContainer}>
      <TouchableOpacity onPress={() => openImageModal(item.image)}>
        <Text style={styles.customerId}>{item.name}</Text>
        <Text style={styles.content}>{item.content}</Text>
        {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
      </TouchableOpacity>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.acceptButton]} onPress={() => acceptReview(item.reviewId)}>
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.rejectButton]} onPress={() => rejectReview(item.reviewId)}>
          <Text style={styles.buttonText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backContainer} onPress={() => navigation.goBack()}>
          <MaterialIcons name="keyboard-arrow-left" size={24} color="white" />
          <Text style={styles.headerTitle}>Duyệt Review</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={reviewData}
        renderItem={renderReviewItem}
        keyExtractor={(item, index) => index.toString()}
      />

      {/* Modal for displaying enlarged image */}
      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={closeModal}
      >
        <TouchableOpacity style={styles.modalContainer} activeOpacity={1} onPress={closeModal}>
          <Image source={{ uri: selectedImage }} style={styles.modalImage} resizeMode="contain" />
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'white',
  },
  reviewContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    marginTop:10,
  },
  content: {
    fontSize: 16,
    marginBottom: 2,
    marginLeft: 20,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginLeft: 20,
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
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 5,
  },
  button: {
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 50,
  },
  acceptButton: {
    backgroundColor: 'green',
  },
  rejectButton: {
    backgroundColor: 'red',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#ef4d2d',
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backContainer: {
    flexDirection: 'row',
  },
  customerId:{
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 5,
    marginLeft: 5,
  },
  review:{
    textAlign:'center',
    fontSize:18,
    color:'#CCCCCC'
  }
});

export default RestaurantAccept;
