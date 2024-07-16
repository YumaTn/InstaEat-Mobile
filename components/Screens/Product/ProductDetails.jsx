import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator, Modal, TouchableWithoutFeedback } from 'react-native';
import axios from 'axios';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProductDetails = ({ navigation, route }) => {
  const [restaurantDetails, setRestaurantDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { restaurantId } = route.params;
  const [imageCount, setImageCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [customerNames, setCustomerNames] = useState({});
  const [modalVisible, setModalVisible] = useState(false); // State để điều khiển hiển thị Modal
  const [selectedImage, setSelectedImage] = useState(null); // State để lưu đường dẫn ảnh được chọn

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          throw new Error('User token not found');
        }

        // Fetch restaurant details
        const response = await axios.get(`https://instaeat.azurewebsites.net/api/Restaurant/${restaurantId}`, {
          headers: {
            Authorization: `${token}`,
          },
        });
        setRestaurantDetails(response.data);

        // Fetch reviews based on restaurantId and status=1
        const reviewsResponse = await axios.get(`https://instaeat.azurewebsites.net/api/Review/restaurant?status=1`, {
          headers: {
            Authorization: `${token}`,
          },
        });
        if (reviewsResponse.status === 200) {
          const filteredReviews = reviewsResponse.data.items.filter(review => review.restaurantId === restaurantId);
          setReviews(filteredReviews);

          // Count images and comments
          let images = 0;
          let comments = 0;
          filteredReviews.forEach(review => {
            if (review.image) {
              images++;
            }
            if (review.content) {
              comments++;
            }
          });
          setImageCount(images);
          setCommentCount(comments);

          // Fetch customer names for each review
          const namesPromises = filteredReviews.map(async (review) => {
            const accountResponse = await axios.get(`https://instaeat.azurewebsites.net/api/Account/${review.customerId}`, {
              headers: {
                Authorization: `${token}`,
              },
            });
            return { customerId: review.customerId, name: accountResponse.data.name };
          });
          const names = await Promise.all(namesPromises);
          const namesMap = {};
          names.forEach((nameData) => {
            namesMap[nameData.customerId] = nameData.name;
          });
          setCustomerNames(namesMap);
        } else {
          throw new Error('Failed to fetch review data');
        }
      } catch (error) {
        console.error('Error fetching restaurant details:', error);
        setError('Failed to fetch restaurant details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantDetails();
  }, [restaurantId]);

  // Function to open the modal with selected image
  const handleImagePress = (imageUri) => {
    setSelectedImage(imageUri);
    setModalVisible(true);
  };

  // Function to close the modal
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
      <View style={styles.loadingContainer}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.body}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backIcon} onPress={() => navigation.navigate('Navigation')}>
          <MaterialIcons name="keyboard-arrow-left" size={24} color="white" />
          <Text style={styles.header}>{restaurantDetails.restaurantName}</Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View style={styles.upAndCheckIn}>
          <TouchableOpacity style={styles.commentUser} onPress={() => navigation.navigate('Review', { restaurantId })}>
            <MaterialIcons name="reviews" size={24} color="#CCCCCC" paddingLeft={10} />
            <Text style={styles.text3}>Review</Text>
          </TouchableOpacity>
        </View>
        <Image style={styles.image} source={require('../../../assets/images/background.jpg')} />
        <Text style={styles.tilteRestaurant}>{restaurantDetails.restaurantName}</Text>

        <View>
          <View style={styles.info}>
            <View style={styles.DetailInfo}>
              <Text style={styles.NumberCount}>{imageCount}</Text>
              <Text>Hình Ảnh</Text>
            </View>
            <View style={styles.DetailInfo}>
              <Text style={styles.NumberCount}>{commentCount}</Text>
              <Text>Bình luận</Text>
            </View>
          </View>
          <View style={styles.OpenAndOff}>
            <Text style={styles.OpenAndOffTitle}>Mở cửa:</Text>
            <Text style={styles.OpenAndOffClock}>
              {restaurantDetails.openTime} - {restaurantDetails.closeTime}
            </Text>
            <Text>
              <Text style={styles.address}>Địa chỉ:</Text>
              {restaurantDetails.address}
            </Text>
          </View>
          <View style={styles.commentContainer}>
            <Text style={styles.commentUser}>{commentCount} bình luận</Text>
            {reviews.map((review, index) => (
              <TouchableWithoutFeedback key={index} onPress={() => handleImagePress(review.image)}>
                <View style={styles.commentItem}>
                  <Text style={styles.customerId}>{customerNames[review.customerId]}:</Text>
                  <Text style={styles.commentText}>{review.content}</Text>
                  {review.image && <Image source={{ uri: review.image }} style={styles.commentImage} />}
                </View>
              </TouchableWithoutFeedback>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Modal to display selected image */}
      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback onPress={closeModal}>
            <View style={styles.modalBackground} />
          </TouchableWithoutFeedback>
          <View style={styles.modalContent}>
            <Image source={{ uri: selectedImage }} style={styles.modalImage} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    backgroundColor: 'white',
    width: '100%',
    flex: 1,
  },
  container: {
    paddingBottom: 20,
    paddingTop: 50,
    backgroundColor: '#ef4d2d',
    flexDirection: 'row',
    alignItems: 'center',
  },
  header: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    marginLeft: 10,
  },
  upAndCheckIn: {
    flexDirection: 'row',
    backgroundColor: '#1C1B1F',
    padding: 5,
    justifyContent: 'center',
  },
  commentUser: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 10,
    paddingLeft: 1,
  },
  text1: {
    color: 'white',
  },
  text2: {
    color: 'white',
  },
  text3: {
    color: 'white',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  info: {
    borderBottomWidth: 1,
    borderColor: '#CCCCCC',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  DetailInfo: {
    alignItems: 'center',
  },
  NumberCount: {
    fontWeight: 'bold',
  },
  backIcon: {
    color: 'white',
    marginTop: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tilteRestaurant: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    fontSize: 16,
    fontWeight: 'bold',
  },
  OpenAndOff: {
    padding: 15,
  },
  OpenAndOffTitle: {
    fontSize: 15,
    color: 'green',
    fontWeight: 'bold',
  },
  OpenAndOffClock: {
    color: 'gray',
  },
  address: {
    fontSize: 15,
  },
  commentContainer: {
    padding: 10,
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#CCCCCC',
  },
  commentItem: {
    marginVertical: 10,
    borderTopWidth: 1,
    borderColor: '#CCCCCC',
  },
  commentText: {
    fontSize: 16,
    marginBottom: 2,
    marginLeft: 20,
  },
  commentImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginLeft: 20,
  },
  customerId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 5,
    marginLeft: 2,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalBackground: {
    flex: 1,
    width: '100%',
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:300,
  },  
  modalImage: {
    width: 400,
    height: 400,
    resizeMode: 'cover',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});

export default ProductDetails;
