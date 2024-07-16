import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, Alert, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

export default function Review({ route, navigation }) {
  const { restaurantId } = route.params;
  const [comment, setComment] = useState('');
  const [imageUri, setImageUri] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const submitReview = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Error', 'User ID not found');
        return;
      }

      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Error', 'Token not found');
        return;
      }

      if (!imageUri) {
        Alert.alert('Error', 'Please select an image');
        return;
      }

      const formData = new FormData();
      formData.append('Content', comment);
      formData.append('restaurantId', restaurantId.toString());
      formData.append('customerId', userId);

      const filename = imageUri.split('/').pop();
      const imageData = {
        uri: imageUri,
        name: filename,
      };
      formData.append('Image', imageData);

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `${token}`,
        },
      };

      const response = await axios.post('https://instaeat.azurewebsites.net/api/Review/restaurant', formData, config);

      if (response.status === 200) {
        navigation.goBack();
      } else {
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      console.log('Error Details:', error);
      if (error.response) {
        console.log('Server Error:', error.response.data);
      }
      Alert.alert('Error', 'An error occurred while submitting the review');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headers}>
        <TouchableOpacity style={styles.titleContainer} onPress={() => navigation.goBack()}>
          <MaterialIcons name="keyboard-arrow-left" size={25} color="white" />
          <Text style={styles.title}>Review</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Viết bình luận của bạn"
        value={comment}
        onChangeText={setComment}
        placeholderTextColor="black"
      />
      <TouchableOpacity style={styles.UploadImage} onPress={pickImage}>
        <AntDesign name="picture" size={24} color="black" />
        <Text style={styles.UploadImageText}>Tải ảnh lên</Text>
      </TouchableOpacity>
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      <TouchableOpacity style={styles.button} onPress={submitReview}>
        <Text style={styles.submit}>Xác nhận</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  headers: {
    backgroundColor: '#ef4d2d',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    fontWeight: 'bold',
    marginBottom: 16,
    paddingTop: 40,
    color: 'white',
  },
  input: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 16,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 16,
  },
  button: {
    borderWidth: 1,
    borderColor: 'orange',
    backgroundColor: 'white',
    padding: 12,
    marginLeft: 140,
    marginRight: 140,
    marginTop: 20,
    borderRadius: 10,
    backgroundColor: 'orange',
  },
  submit: {
    color: 'white',
    textAlign: 'center',
    fontSize: 17,
  },
  UploadImageText: {
    fontSize: 17,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  UploadImage: {
    flexDirection: 'row',
    marginLeft: 5,
    borderWidth: 1,
    marginRight: 280,
    paddingLeft: 7,
    borderRadius: 5,
  },
});
