import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SplashScreen_3({ navigation }) {
  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        navigation.navigate('Navigation');
      }
    } catch (error) {
      console.error('Error retrieving token:', error);
    }
  };

  const handleGetStart = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        navigation.navigate('Navigation');
      } else {
        navigation.navigate('Login');
      }
    } catch (error) {
      console.error('Error checking token:', error);
      navigation.navigate('Login');
    }
  };

  return (
    <View style={styles.container}>
      <Image 
        source={require('../../../assets/images/Plash3.jpg')}
        style={styles.image}
      />
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.button} onPress={handleGetStart}>
          <Text fadeDuration={0} style={styles.buttonText}>Get Start!</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  text: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 100,
  },
  button: {
    position: 'absolute',
    bottom: 50,
    left: '50%',
    transform: [{ translateX: -50 }],
    backgroundColor: 'purple',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
});
