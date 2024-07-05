import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

const RestaurantHome = ({navigation}) => {
  const restaurantDetails = {
    restaurantName: "Tên nhà hàng mẫu",
    openTime: "07:00",
    closeTime: "22:00",
    address: "123 Đường ABC, Quận XYZ, Thành phố HCM",
    images: [],
    comments: []
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>{restaurantDetails.restaurantName}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('ShopPoint')}>
        <FontAwesome5 name="coins" size={22} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView>
        <Image style={styles.image} source={require('../../../assets/images/background.jpg')} />
        <Text style={styles.tilteRestaurant}>{restaurantDetails.restaurantName}</Text>

        <View style={styles.info}>
          <View style={styles.DetailInfo}>
            <Text style={styles.NumberCount}>{restaurantDetails.images.length}</Text>
            <Text>Hình Ảnh</Text>
          </View>
          <View style={styles.DetailInfo}>
            <Text style={styles.NumberCount}>{restaurantDetails.comments.length}</Text>
            <Text>Bình luận</Text>
          </View>
        </View>
        <View style={styles.empty}></View>

        <ScrollView horizontal style={styles.imageContainer}>
          {restaurantDetails.images.map((image, index) => (
            <Image key={index} style={styles.smallImage} source={image} />
          ))}
        </ScrollView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop:50,
    backgroundColor: 'purple',
  },
  header: {
    fontSize: 20,
    color: 'white',
    flex: 1,
  },
  icon: {
    width: 30,
    height: 30,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  tilteRestaurant: {
    fontSize: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  DetailInfo: {
    alignItems: 'center',
  },
  NumberCount: {
    fontWeight: 'bold',
  },
  OpenAndOff: {
    padding: 15,
  },
  OpenAndOffTitle: {
    color: 'green',
    fontSize: 15,
    fontWeight: 'bold',
  },
  OpenAndOffClock: {
    color: 'gray',
  },
  empty: {
    height: 10,
    backgroundColor: '#CCCCCC',
  },
  smallImage: {
    width: 100,
    height: 100,
    marginHorizontal: 5,
    resizeMode: 'cover',
  },
  imageContainer: {
    padding: 10,
    flexDirection: 'row',
  },
  CommentCount: {
    fontSize: 15,
    paddingTop: 20,
    paddingLeft: 10,
  },
  commentContainer: {
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#CCCCCC',
  },
  commentUser: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  commentText: {
    marginBottom: 10,
  },
  iconComment: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  commentContainerMore: {
    alignItems: 'center',
    paddingBottom: 10,
  },
  commentMoreText: {
    color: 'blue',
  },
  address: {
    paddingTop: 10,
    color: '#999999',
  },
});

export default RestaurantHome;
