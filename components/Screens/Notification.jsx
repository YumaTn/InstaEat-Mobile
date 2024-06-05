import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const Notification = () => {
  const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f8f8f8',
    },
  })
  return (
    <View style={styles.container}>
      <Text>Notification</Text>
    </View>
  )
}

export default Notification