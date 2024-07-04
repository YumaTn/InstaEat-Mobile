import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = ({ navigation }) => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                if (!token) {
                    throw new Error('User token not found');
                }
 
                const userUrl = 'https://instaeat.azurewebsites.net/api/Account';
                const response = await fetch(userUrl, {
                    headers: {
                        Authorization:`${token}`
                    }
                });
                console.log(token)
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }

                const userDataResponse = await response.json();

                if (userDataResponse.items && userDataResponse.items.length > 0) {
                    // Assuming the first item in the array is the user data
                    setUserData(userDataResponse.items[4]);
                } else {
                    throw new Error('No user data found in API response');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                Alert.alert('Error', 'Failed to fetch user data. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('userToken');
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
            <Text>{userData.name}</Text>
            <Text style={styles.sectionHeader}>Thông tin người dùng:</Text>
            <Text style={styles.userInfo}>Tên đăng nhập: {userData ? userData.username : 'N/A'}</Text>
            <Text style={styles.userInfo}>Tên: {userData ? userData.name : 'N/A'}</Text>
            <Text style={styles.userInfo}>Số điện thoại: {userData ? userData.phone : 'N/A'}</Text>
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
        paddingHorizontal: 20,
        paddingTop: 50,
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
        marginTop: 20,
        backgroundColor: 'purple',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    logoutText: {
        color: 'white',
        fontSize: 16,
    },
});

export default Profile;
