import React from 'react';
import {StyleSheet, View } from 'react-native';
import App from '../../components/Screens/App';
export default function HomeScreen() {
  const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'purple',
    },
  })
  return (
    <View style={styles.container}>
          <App/>
      </View>
  );
}


