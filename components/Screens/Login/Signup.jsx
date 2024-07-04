import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableWithoutFeedback, Keyboard, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';

const SignUp = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');

    const handleSignUp = async () => {
      try {
          const response = await axios.post('https://instaeat.azurewebsites.net/api/Account/register', {
              username: username,
              password: password,
              name: name,
              phone: phone.toString() // Ensure phone number is sent as a string
          });
  
          console.log('Response from API:', response.data);
          Alert.alert('Đăng ký thành công');
          navigation.navigate('Login');
      } catch (error) {
          console.error('Error while signing up:', error);
          Alert.alert('Đăng ký thất bại', error.message);
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
            left: '36%',
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
        button: {
            position: 'absolute',
            top: '78%',
            width: '20',
            padding: 15,
            backgroundColor: 'orange',
            borderRadius: 40,
            alignItems: 'center',
        },
        loginText: {
            color: 'white',
        }
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
                    <Text style={styles.text2}>Đăng Ký</Text>
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        onChangeText={setName}
                        value={name}
                        placeholder="Tên"
                        placeholderTextColor="black"
                        keyboardType="default"
                    />
                    <TextInput
                        style={styles.input}
                        onChangeText={setUsername}
                        value={username}
                        placeholder="Tên đăng nhập"
                        placeholderTextColor="black"
                        keyboardType="default"
                    />
                    <TextInput
                        style={styles.input}
                        onChangeText={setPassword}
                        value={password}
                        placeholder="Mật khẩu"
                        placeholderTextColor="black"
                        secureTextEntry={true}
                    />
                    <TextInput
                        style={styles.input}
                        onChangeText={setPhone}
                        value={phone}
                        placeholder="Số điện thoại"
                        placeholderTextColor="black"
                        keyboardType="phone-pad"
                    />
                </View>
                <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                    <Text style={styles.loginText}>Đăng Ký</Text>
                </TouchableOpacity>
                <Image source={require('../../../assets/images/Line 4.png')} />
            </View>
        </TouchableWithoutFeedback>
    );
};

export default SignUp;
