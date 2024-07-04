import { View, Text, StyleSheet, Image, TextInput, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';
import React from 'react';

const SignUp = ({ navigation }) => {
    const [email, onChangeEmail] = React.useState('');
    const [password, onChangePassword] = React.useState('');
    const [confirmPassword, onChangeConfirmPassword] = React.useState('');

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
        inputContainer3: {
          position: 'absolute',
          top: '56%',
          width: '80%',
          paddingHorizontal: 20,
      },
        button: {
            position: 'absolute',
            top: '64%',
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
                        onChangeText={onChangeEmail}
                        value={email}
                        placeholder="Email ..."
                        placeholderTextColor="black"
                        keyboardType="email-address"
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
                <View style={styles.inputContainer3}>
                    <TextInput
                        style={styles.input}
                        onChangeText={onChangeConfirmPassword}
                        value={confirmPassword}
                        placeholder="Xác nhận mật khẩu ..."
                        placeholderTextColor="black"
                        secureTextEntry={true}
                    />
                </View>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.loginText}>Đăng Ký</Text>
                </TouchableOpacity>
                <Image source={require('../../../assets/images/Line 4.png')} />
            </View>
        </TouchableWithoutFeedback>
    );
};

export default SignUp;
