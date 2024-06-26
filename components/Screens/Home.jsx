import { View, Text, StyleSheet, TextInput, Image } from 'react-native';
import React from 'react';
import { AntDesign } from '@expo/vector-icons';
import Product from './Product/Product'
import { FontAwesome } from '@expo/vector-icons';
const Home = ({ navigation }) => {
  const [number, onChangeNumber] = React.useState('');

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    GreenSpace: {
      backgroundColor: 'purple',
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16, // Optional: add padding to create space around the content
      backgroundColor: 'purple',
    },
    searchContainer: {
      marginTop:15,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'white',
      borderRadius: 20,
      height: 40,
      paddingHorizontal: 10,
      width: '80%',
    },
    input: {
      flex: 1,
      paddingLeft: 10, // Add padding to avoid overlapping with the icon
      color: 'black', // Thay đổi màu của văn bản trong TextInput
    },
    icon: {
      marginLeft: 10,
    },
    TitleRestaurant:{
      marginTop:10,
      fontSize:15,
    },
    User:{
      marginLeft:40,
      marginTop:10,
    }
  });

  return (
    <View style={styles.container}>
      <View style={styles.GreenSpace}></View>
      <View style={styles.titleContainer}>
        <View style={styles.searchContainer}>
          <AntDesign name="search1" size={24} color="black" style={styles.icon} />
          <TextInput
            style={styles.input}
            onChangeText={onChangeNumber}
            value={number}
            placeholder="Đồ ăn,Quán Ăn,..."
          />
        </View>
        <FontAwesome style={styles.User} name="user-circle" size={24} color="black"/>
      </View>
      <Product navigation={navigation}/>
    </View>
  );
};

export default Home;
