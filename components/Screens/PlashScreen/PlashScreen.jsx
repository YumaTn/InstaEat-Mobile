import React, { useEffect } from 'react';
import { View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

import loader from '../../../loader.json';
import LottieView from 'lottie-react-native';

const PlashScreen = ({ navigation }) => {
  useEffect(() => {
    const checkTokenAndRedirect = async () => {
      try {
        const roleId = await AsyncStorage.getItem('roleId');
        console.log(roleId)
        await new Promise(resolve => setTimeout(resolve, 3000));
        if (roleId) {
          if (roleId === '2') {
            navigation.navigate('Navigation');
          } else if (roleId === '3') {
            navigation.navigate('RNavigation');
          }
        } else {
          navigation.navigate('Login');
        }
      } catch (error) {
        console.error('Error checking token and roleId:', error);
      }
    };

    checkTokenAndRedirect();
  }, [navigation]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',backgroundColor:'white' }}>
      <LottieView
        source={loader}
        autoPlay
        loop
        resizeMode="cover" 
        style={{ width: 600, height: 600 }} 
      />
    </View>
  );
};

export default PlashScreen;
