import React from 'react';
import { View, Image, StatusBar, StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function PlashScreen_1({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar translucent={true} backgroundColor="transparent"/>
      <Image
        source={require('../../../assets/images/Plash1.jpg')}
        style={styles.image}
        fadeDuration={0}
      />
      <Text style={styles.text}>
        Welcome to Food Check-in!{'\n'}Discover delicious dishes and exciting dining spots near you.
      </Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Plash_2')}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
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
    position: 'absolute', // Đặt hình ảnh tuyệt đối để nó trở thành nền
  },
  text: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    marginTop: 'auto', // Đẩy văn bản lên trên để nằm ở giữa
    marginBottom: 100, // Tạo khoảng trống phía dưới văn bản
    paddingHorizontal: 20,
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
