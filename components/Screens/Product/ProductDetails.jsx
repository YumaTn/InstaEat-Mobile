import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const ProductDetails = ({ navigation, }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await fetch();
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        setError(error.message);
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

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

  return (
    <View style={styles.body}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.navigate('Navigation')}>
          <Text style={styles.header}>InstaEat</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.upAndCheckIn}>
        <TouchableOpacity style={styles.camera} onPress={takePhoto}>
          <Image source={require('../../../assets/images/camera.png')} />
          <Text style={styles.text1}>Chụp Hình</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.camera} onPress={pickImage}>
          <Image source={require('../../../assets/images/Gallery.png')} />
          <Text style={styles.text2}>Tải Hình</Text>
        </TouchableOpacity>
      </View>
      <View>
  {selectedImage && <Image style={styles.image} source={{ uri: selectedImage }} />}
  {!selectedImage && item && <Image style={styles.image} source={{ uri: item.image }} />}
  <View style={styles.info}>
    <View style={styles.DetailInfo}>
      <Text>10</Text>
      <Text>Hình Ảnh</Text>
    </View>
    <View style={styles.DetailInfo}>
      <Text>50</Text>
      <Text>Comment</Text>
    </View>
  </View>
</View>
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
  },
  header: {
    top: '50%',
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
  text1: {
    color: 'white',
  },
  text2: {
    color: 'white',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  title: {
    marginTop: 10,
    fontSize: 15,
    textTransform: 'capitalize',
  },
  info: {
    elevation: 1,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'orange',
  },
  DetailInfo: {
    alignItems: 'center',
  },
});

export default ProductDetails;
