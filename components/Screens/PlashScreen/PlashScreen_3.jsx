import React from 'react';
import { View, Image, StatusBar, StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function PlashScreen_3({ navigation }) {
  return (
    <View style={styles.container}>
      <Image 
        source={require('../../../assets/images/Plash3.jpg')}
        style={styles.image}
      />
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.buttonText} >Get Start!</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      position: 'relative', // Đổi position từ 'absolute' sang 'relative' để overlay và button không tràn lên nhau
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
      marginBottom: 100, // Đưa về 100 để tạo khoảng trống dưới
    },
    button: {
      position: 'absolute',
      bottom: 50, // Điều chỉnh bottom theo ý muốn của bạn
      left: '50%', // Đưa button ra giữa màn hình
      transform: [{ translateX: -50 }], // Dịch button sang trái một nửa chiều rộng của nó
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
  
