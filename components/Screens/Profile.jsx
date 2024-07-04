import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = ({ navigation }) => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const fetchTokenAndUserData = async () => {
            try {
                const loginUrl = 'https://instaeat.azurewebsites.net/api/Account/login';
                const loginData = {
                    username: 'nam1',
                    password: 'nam123456'
                };

                const response = await fetch(loginUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(loginData)
                });

                if (!response.ok) {
                    throw new Error('Failed to authenticate');
                }

                const loginResponse = await response.json();
                const retrievedToken = loginResponse.token;

                if (!retrievedToken) {
                    throw new Error('Token not found in response');
                }

                await AsyncStorage.setItem('userToken', retrievedToken);
                setToken(retrievedToken);

                // Fetch user data using the retrieved token
                fetchUserData(retrievedToken);
            } catch (error) {
                console.error('Error fetching token:', error);
                Alert.alert('Error', 'Failed to authenticate. Please try again.');
                setLoading(false); // Set loading to false to stop the loading indicator
            }
        };

        fetchTokenAndUserData();
    }, []);

    const fetchUserData = async (token) => {
        try {
            const userUrl = 'https://instaeat.azurewebsites.net/api/Account';
            const userResponse = await fetch(userUrl, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(token)
            if (!userResponse.ok) {
                throw new Error('Failed to fetch user data');
            }

            const userDataResponse = await userResponse.json();

            if (userDataResponse.items && userDataResponse.items.length > 0) {
                // Find the user with username 'nam1' (assuming it's unique)
                const user = userDataResponse.items.find(user => user.username === 'nam1');
                if (user) {
                    setUserData(user);  
                } else {
                    console.error('User data not found for username "nam1"');
                }
            } else {
                console.error('No user data found in API response');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            Alert.alert('Error', 'Failed to fetch user data. Please try again.');
        } finally {
            setLoading(false); // Set loading to false after fetching user data
        }
    };

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('userToken');
            setToken(null);
            setUserData(null);
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
          <Text>{userData ? userData.name : 'N/A'}</Text>
            <Text style={styles.sectionHeader}>Thông tin người dùng:</Text>
            <Text style={styles.userInfo}>Tên đăng nhập: {userData ? userData.username : 'N/A'}</Text>
            <Text style={styles.userInfo}>Tên: {userData ? userData.name : 'N/A'}</Text>
            <Text style={styles.userInfo}>Số điện thoại: {userData ? userData.phone : 'N/A'}</Text>

            <Text style={styles.tokenText}>Token: {token}</Text>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Đăng xuất</Text>
            </TouchableOpacity>
        </View>
    );
}

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
    tokenText: {
        fontSize: 14,
        marginTop: 10,
        marginBottom: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
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
