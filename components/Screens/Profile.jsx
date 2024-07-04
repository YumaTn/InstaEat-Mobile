import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Profile = ({ navigation }) => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                if (!token) {
                    navigation.navigate('Login'); // Redirect to login if no token is found
                    return;
                }

                const url = 'https://instaeat.azurewebsites.net/api/Account';
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setUserData(response.data.items[0]); // Assuming only one user is returned
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <View style={styles.body}>
            <View style={styles.container}>
                <Text style={styles.header}>{userData ? userData.name : ''}</Text>
                <TouchableOpacity onPress={async () => {
                    await AsyncStorage.removeItem('userToken');
                    navigation.navigate('Login');
                }}>
                    <TouchableOpacity style={styles.restaurant}  onPress={() => navigation.navigate('UpdateToRestaurant')}>
                      <Text>Đăng ký làm nhà hàng</Text>
                    </TouchableOpacity>
                </TouchableOpacity>
            </View>
            <Text style={styles.information}>Thông tin:</Text>
            <Text style={styles.Username}>Tên đăng nhập: {userData ? userData.username : ''}</Text>
            <Text style={styles.password}>Mật Khẩu: {userData ? userData.password : ''}</Text>
            <Text style={styles.name}>Tên: {userData ? userData.name : ''}</Text>
            <Text style={styles.number}>Số điện thoại: {userData ? userData.phone : ''}</Text>
            <TouchableOpacity style={styles.voucherContainer}>
                <Text style={styles.voucher}>
                    <Image style={styles.image} source={require('../../assets/images/voucher.png')} /> Voucher
                </Text>
                <Image style={styles.arrowRight} source={require('../../assets/images/arrowright.png')} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.rewardPointerContainer}>
                <Text style={styles.point}>
                    <Image style={styles.imagePoint} source={require('../../assets/images/point.png')} /> Reward Point
                </Text>
                <Image style={styles.arrowRight} source={require('../../assets/images/arrowright.png')} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.LogoutContainer}>
              <Text style={styles.logout}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    body: {
        backgroundColor: 'white',
        width: '100%',
        flex: 1,
    },
    container: {
        paddingTop: 73,
        paddingLeft: 20,
        paddingBottom: 20,
        backgroundColor: 'purple',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    header: {
        marginLeft: 20,
        color: 'white',
        fontSize: 15,
        textTransform: 'uppercase',
    },
    restaurant: {
        color: 'white',
        marginRight: 30,
    },
    information: {
        marginTop: 40,
        marginLeft: 5,
    },
    Username: {
        marginLeft: 40,
        marginTop: 20,
    },
    password: {
        marginLeft: 40,
        marginTop: 10,
    },
    name: {
        marginLeft: 40,
        marginTop: 10,
    },
    number: {
        marginLeft: 40,
        marginTop: 10,
    },
    voucher: {
        fontSize: 17,
        marginLeft: 10,
    },
    voucherContainer: {
        flexDirection: 'row',
        marginTop: 50,
        paddingBottom: 10,
        paddingLeft: 10,
        backgroundColor: 'orange',
        elevation: 2,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    image: {
        width: 30,
        height: 30,
        marginLeft: 10,
    },
    arrowRight: {
        marginTop: 13,
        width: 20,
        height: 20,
    },
    rewardPointerContainer: {
        flexDirection: 'row',
        marginTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        backgroundColor: 'orange',
        elevation: 2,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    imagePoint: {
        width: 20,
        height: 20,
        marginLeft: 10,
    },
    point: {
        marginTop: 5,
        marginLeft: 15,
        fontSize: 17,
    },
    logout:{
      marginTop:10,
      marginBottom:10,
      fontSize:23,
      color:'white',
    },
    LogoutContainer: {
      flexDirection: 'row',
      marginTop: 300,
      paddingBottom: 10,
      paddingLeft: 150,
      backgroundColor: 'gray',
      elevation: 2,
      alignItems: 'center',
      justifyContent: 'space-between',
      width:'90%',
      marginLeft:20,
      borderRadius:5
  },
});

export default Profile;
