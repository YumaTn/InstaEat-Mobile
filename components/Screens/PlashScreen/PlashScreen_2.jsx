import React from 'react';
import { View, Image, StatusBar, StyleSheet, Text, TouchableOpacity, SafeAreaView } from 'react-native';

export default function PlashScreen_2({ navigation }) {
  return (
    <>
      <StatusBar translucent backgroundColor="transparent" /> 
      <SafeAreaView style={styles.container}>
        <Image 
          source={require('../../../assets/images/Plash2.jpg')}
          style={styles.image}
          fadeDuration={0}
        />
        <View style={styles.content}>
          <Text style={styles.text}>
            Key Features:{'\n'}Explore diverse cuisines{'\n'}Receive special promotions
          </Text>
          <TouchableOpacity style={[styles.button, { bottom: 80 }]} onPress={() => navigation.navigate('Plash_3')}>
            <Text style={styles.buttonText} >Next</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
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
    position: 'absolute', 
  },
  content: {
    flex: 1,
    alignItems: 'center', // Căn giữa theo chiều ngang
    justifyContent: 'center', // Căn giữa theo chiều dọc
  },
  text: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  button: {
    position: 'absolute',
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
