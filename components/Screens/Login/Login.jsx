import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Image, TouchableWithoutFeedback, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        checkIfLoggedIn();
    }, []);

    // Kiểm tra xem người dùng đã đăng nhập trước đó hay chưa
    const checkIfLoggedIn = async () => {
        const token = await getToken();
        if (token) {
            navigation.navigate('Navigation');
        }
    };

    // Hàm để lấy token từ AsyncStorage
    const getToken = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            return token;
        } catch (error) {
            console.error('Error retrieving token:', error);
            return null;
        }
    };

    // Hàm xử lý đăng nhập
    const handleLogin = async () => {
        try {
            if (!username || !password) {
                Alert.alert('Vui lòng điền tên đăng nhập và mật khẩu');
                return;
            }
    
            // Call API to check login
            const URL = 'https://instaeat.azurewebsites.net/api/Account/login';
            const response = await fetch(URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
            });
    
            if (!response.ok) {
                throw new Error('Invalid credentials');
            }
    
            const data = await response.json();
            const newToken = data.token; // Lấy token từ phản hồi API
    
            // Lưu token vào AsyncStorage với tiền tố 'Bearer'
            await AsyncStorage.setItem('userToken', `Bearer ${newToken}`);
    
            // Lấy thông tin người dùng từ phản hồi API (vd: profile)
            const profile = data.profile[0];
            const { userId, roleId, name, phone } = profile; // Lấy thông tin cần thiết từ profile
    
            // Lưu trữ thông tin người dùng vào AsyncStorage
            await AsyncStorage.multiSet([
                ['userId', userId.toString()],
                ['username', username],
                ['password', password],
                ['name', name],
                ['roleId', roleId.toString()],
                ['phone', phone],
            ]);
    
            // Xóa dữ liệu trong input sau khi đăng nhập thành công
            setUsername('');
            setPassword('');
    
            // Kiểm tra roleId và điều hướng tương ứng
            if (roleId === 1) {
                Alert.alert('Thông báo', 'Bạn không có quyền truy cập');
            } else if (roleId === 2) {
                navigation.navigate('Navigation');
            } else if (roleId === 3) {
                navigation.navigate('RNavigation');
            } else {
                Alert.alert('Thông báo', 'Tài khoản của bạn không có quyền truy cập');
            }
        } catch (error) {
            console.error('Error:', error.message);
            Alert.alert('Error', 'Đăng nhập thất bại. Vui lòng thử lại.');
        }
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: 'purple',
            justifyContent: 'center',
            alignItems: 'center',
        },
        textContainer: {
            position: 'absolute',
            top: '20%',
            left: '15%',
        },
        image1: {
            alignSelf: 'flex-start',
        },
        image2: {
            alignSelf: 'flex-end',
        },
        text: {
            color: 'white',
            fontSize: 80,
        },
        textContainer2: {
            position: 'absolute',
            top: '33%',
            left: '30%',
            alignItems: 'center',
        },
        text2: {
            color: 'white',
            fontSize: 30,
        },
        inputContainer: {
            position: 'absolute',
            top: '40%',
            width: '80%',
            paddingHorizontal: 20,
        },
        input: {
            height: 40,
            padding: 10,
            backgroundColor: 'white',
            borderRadius: 5,
            marginVertical: 10,
        },
        inputContainer2: {
            position: 'absolute',
            top: '48%',
            width: '80%',
            paddingHorizontal: 20,
        },
        button: {
            position: 'absolute',
            top: '58%',
            width: '30%',
            padding: 15,
            backgroundColor: 'orange',
            borderRadius: 40,
            alignItems: 'center',
        },
        Signup: {
            position: 'absolute',
            top: '70%',
            lineHeight: 1,
        },
        SignuUpText: {
            color: 'white',
        },
    });

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <Image style={styles.image1} source={require('../../../assets/images/Line.png')} />
                <Image style={styles.image2} source={require('../../../assets/images/Line2.png')} />
                <View style={styles.textContainer}>
                    <Text style={styles.text}>InstaEat</Text>
                </View>
                <View style={styles.textContainer2}>
                    <Text style={styles.text2}>Đăng Nhập</Text>
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        onChangeText={setUsername}
                        value={username}
                        placeholder="Tên đăng nhập "
                        placeholderTextColor="black"
                    />
                </View>
                <View style={styles.inputContainer2}>
                    <TextInput
                        style={styles.input}
                        onChangeText={setPassword}
                        value={password}
                        placeholder="Mật khẩu "
                        placeholderTextColor="black"
                        secureTextEntry={true}
                    />
                </View>
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text>Đăng Nhập</Text>
                </TouchableOpacity>
                <Image source={require('../../../assets/images/Line 4.png')} />
                <TouchableOpacity style={styles.Signup} onPress={() => navigation.navigate('SignUp')}>
                    <Text style={styles.SignuUpText}>Bạn chưa có tài khoản ?</Text>
                </TouchableOpacity>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default Login;
