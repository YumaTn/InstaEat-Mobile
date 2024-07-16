import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
const Profile = ({ navigation }) => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getUserDataFromStorage = async () => {
            try {
                const username = await AsyncStorage.getItem('username');
                const password = await AsyncStorage.getItem('password');
                const name = await AsyncStorage.getItem('name');
                const phone = await AsyncStorage.getItem('phone');

                setUserData({
                    username: username || 'N/A',
                    password: '*'.repeat(password?.length || 0) || 'N/A',
                    name: name || 'N/A',
                    phone: phone || 'N/A',
                });
            } catch (error) {
                console.error('Error getting user data from storage:', error);
                Alert.alert('Error', 'Failed to get user data from storage. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        getUserDataFromStorage();
    }, []);

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('userToken');
            await AsyncStorage.removeItem('username');
            await AsyncStorage.removeItem('password');
            await AsyncStorage.removeItem('name');
            await AsyncStorage.removeItem('phone');
            await AsyncStorage.removeItem('userId');
            await AsyncStorage.removeItem('roleId');
            await AsyncStorage.removeItem('restaurantId');
            navigation.navigate('Login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="purple" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>{userData ? userData.name : 'N/A'}</Text>
                <TouchableOpacity style={styles.restaurant} onPress={() => navigation.navigate('UpdateToRestaurant')}>
                    <Text style={styles.restaurantText}>Đăng ký nhà hàng</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.sectionEdit}>
            <Text style={styles.sectionHeader}>Thông tin người dùng:</Text>
            <TouchableOpacity style={styles.edit} onPress={() => navigation.navigate('EditUser')}>
            <MaterialIcons name="edit" size={24} color="black" />
            </TouchableOpacity>
            </View>
            <Text style={styles.userInfo}>Tên đăng nhập: {userData ? userData.username : 'N/A'}</Text>
            <Text style={styles.userInfo}>Mật khẩu: {userData ? userData.password : 'N/A'}</Text>
            <Text style={styles.userInfo}>Tên: {userData ? userData.name : 'N/A'}</Text>
            <Text style={styles.userInfo}>Số điện thoại: {userData ? userData.phone : 'N/A'}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Wallet')}>
                <View style={styles.wallet}>
                    <Text style={styles.walletTitle}>Wallet</Text>
                    <MaterialIcons name="keyboard-arrow-right" size={24} color="black" justifyContent='flex-end' />
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Đăng xuất</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: 0, // Adjust to ensure titleContainer reaches the top
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    userInfo: {
        fontSize: 16,
        marginBottom: 10,
    },
    logoutButton: {
        marginTop: 30,
        backgroundColor: '#ef4d2d',
        padding: 10,
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    logoutText: {
        color: 'white',
        fontSize: 16,
    },
    restaurant: {
        cursor: 'pointer',
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        paddingTop:58,
        backgroundColor: '#ef4d2d',
        justifyContent: 'space-between',
        width: '100%',
    },
    titleText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    restaurantText: {
        color: 'white',
    },
    wallet: {
        borderWidth: 1,
        borderColor: '#CCCCCC',
        padding: 15,
        marginTop: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    walletTitle: {
        fontSize: 15,
    },
    sectionEdit:{
        flexDirection: 'row',
        alignItems: 'center',
         justifyContent:'space-between'
    },
    edit:{
        top:5,
        marginRight:7,
    },
});

export default Profile;
