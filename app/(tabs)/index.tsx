import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import Login from '../../components/Screens/Login/Login';
import App from '../../components/Screens/App';
export default function HomeScreen() {
  const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'purple',
    },
  })
  return (
    <><View style={styles.container}>
          <App/>
      </View>
    </>
  );
}


