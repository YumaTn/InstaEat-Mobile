import { View, Text, StyleSheet, Image, TextInput, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';
import React from 'react';

const Login = ({ navigation }) => {
    const [text, onChangeText] = React.useState('');
    const [password, onChangePassword] = React.useState('');

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
        button:{
            position: 'absolute',
            top: '58%',
            width: '20',
            padding: 15,
            backgroundColor: 'orange',
            borderRadius: 40,
            alignItems: 'center',
        },
        Signup:{
            position:'absolute',
            top:'65%',
            color:'blue',
            lineHeight:1,
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
                    <Text style={styles.text2}>Đăng Nhập</Text>
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        onChangeText={onChangeText}
                        value={text}
                        placeholder="Đăng nhập ..."
                        placeholderTextColor="black"
                    />
                </View>
                <View style={styles.inputContainer2}>
                    <TextInput
                        style={styles.input}
                        onChangeText={onChangePassword}
                        value={password}
                        placeholder="Mật khẩu ..."
                        placeholderTextColor="black"
                        secureTextEntry={true}
                    />
                </View>
                <Text style={styles.Signup}>Đăng ký</Text>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Navigation')}>
                    <Text>Đăng Nhập</Text>
                </TouchableOpacity>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default Login;
