import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { AntDesign, FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProductDetails = ({ navigation,route  }) => {
  const [restaurantDetails, setRestaurantDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { restaurantId } = route.params;
  useEffect(() => {
    (async () => {
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      const libraryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (cameraStatus.status !== 'granted' || libraryStatus.status !== 'granted') {
        Alert.alert(
          'Quyền truy cập bị từ chối',
          'Vui lòng cấp quyền truy cập vào camera và thư viện ảnh.'
        );
      }
    })();
  }, []);

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          throw new Error('User token not found');
        }
        const response = await axios.get(`https://instaeat.azurewebsites.net/api/Restaurant/${restaurantId}`, {
          headers: {
            Authorization: `${token}`,
          },
        });

        setRestaurantDetails(response.data);
      } catch (error) {
        console.error('Error fetching restaurant details:', error);
        setError('Failed to fetch restaurant details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantDetails();
  }, [restaurantId]);
  console.log(restaurantId)
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  };

  const images = [
    require('../../../assets/images/background.jpg'),
    require('../../../assets/images/background.jpg'),
    require('../../../assets/images/background.jpg'),
    require('../../../assets/images/background.jpg'),
    require('../../../assets/images/background.jpg'),
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
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
        </TouchableOpacity>
        <Text style={styles.header}>{restaurantDetails.restaurantName}</Text>
      </View>
      <ScrollView>
        <View style={styles.upAndCheckIn}>
          <TouchableOpacity style={styles.camera} onPress={takePhoto}>
            <Image source={require('../../../assets/images/camera.png')} />
            <Text style={styles.text1}>Chụp Hình</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.camera} onPress={pickImage}>
            <Image source={require('../../../assets/images/Gallery.png')} />
            <Text style={styles.text2}>Tải Hình</Text>
          </TouchableOpacity>
          <TouchableOpacity paddingLeft={10}>
            <FontAwesome5 name="comment-dots" size={22} color="gray" marginLeft={20} />
            <Text style={styles.text3}>Bình luận</Text>
          </TouchableOpacity>
        </View>
        <Image style={styles.image} source={require('../../../assets/images/background.jpg')} />
        <Text style={styles.tilteRestaurant}>{restaurantDetails.restaurantName}</Text>

        <View>
          <View style={styles.info}>
            <View style={styles.DetailInfo}>
              <Text style={styles.NumberCount}>10</Text>
              <Text>Hình Ảnh</Text>
            </View>
            <View style={styles.DetailInfo}>
              <Text style={styles.NumberCount}>50</Text>
              <Text>Bình luận</Text>
            </View>
          </View>
          <View style={styles.OpenAndOff}>
            <Text style={styles.OpenAndOffTitle}>Mở cửa:</Text>
            <Text style={styles.OpenAndOffClock}>
              {restaurantDetails.openTime} - {restaurantDetails.closeTime}
            </Text>
            <Text><Text style={styles.address}>Địa chỉ:</Text>{restaurantDetails.address}</Text>
          </View>
          <View style={styles.empty}></View>
          <ScrollView horizontal style={styles.imageContainer}>
            {images.slice(currentImageIndex).map((image, index) => (
              <Image key={index} style={styles.smallImage} source={image} />
            ))}
          </ScrollView>
          <Text style={styles.CommentCount}>12 bình luận</Text>
        </View>

        <View style={styles.commentContainer}>
          <Text style={styles.commentUser}>Huy:</Text>
          <Text style={styles.commentText}>Bình luận mẫu 1</Text>
          <View style={styles.iconComment}>
            <TouchableOpacity>
              <AntDesign name="hearto" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity>
              <FontAwesome name="comment-o" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.commentContainer}>
          <Text style={styles.commentUser}>Viet:</Text>
          <Text style={styles.commentText}>Bình luận mẫu 2</Text>
          <View style={styles.iconComment}>
            <TouchableOpacity>
              <AntDesign name="hearto" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity>
              <FontAwesome name="comment-o" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.empty}></View>
        <View style={styles.commentContainerMore}>
          <TouchableOpacity>
            <Text style={styles.commentMoreText}>Xem thêm 9 bình luận</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.empty}></View>
      </ScrollView>
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
    padding: 20,
    paddingBottom: 30,
    paddingTop: 40,
    backgroundColor: 'purple',
    flexDirection: 'row',
  },
  header: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },
  upAndCheckIn: {
    flexDirection: 'row',
    backgroundColor: '#1C1B1F',
    padding: 5,
    justifyContent: 'center',
  },
  camera: {
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20,
  },
  commentUser: {
    
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
    borderWidth: 1,
    borderColor: 'gray',
    elevation: 1,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
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
  },
  tilteRestaurant: {
    padding: 10,
    border: '1px solid gray',
    fontSize: 16,
  },
  OpenAndOff: {
    padding: 15,
  },
  OpenAndOffTitle: {
    fontSize: 15,
    color: 'green',
    fontWeight:'bold'
  },
  OpenAndOffClock: {
    color: 'gray',
  },
  empty: {
    backgroundColor: '#CCCCCC',
    height: 10, 
  },
  smallImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    marginHorizontal: 5,
  },
  imageContainer: {
    flexDirection: 'row',
    padding: 10,
  },
  commentContainer: {
    padding: 10,
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#CCCCCC',
    
  },
  commentUser: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  commentText: {
    marginBottom: 10,
  },
  CommentCount:{
    paddingTop:20,
    fontSize:15,
    paddingLeft:10,
  },
  iconComment:{
    flexDirection:'row',
    marginLeft: 100,
    marginRight:110,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  commentContainerMore: {
    padding: 10,
    borderTopColor: '#CCCCCC',
    alignContent:'center'
    
  },
  commentMoreText: {
    textAlign:'center',
    fontWeight:'bold'
  },
  address:{
    fontSize:15,
  }
});

export default ProductDetails;
