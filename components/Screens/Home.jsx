import React from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import Product from './Product/Product';

const Home = ({ navigation }) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
        },
        titleContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 16,
            backgroundColor: 'purple',
            paddingTop: 20,
            paddingBottom: 20,
        },
        searchContainer: {
            marginTop: 15,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'white',
            borderRadius: 20,
            height: 40,
            paddingHorizontal: 10,
            width: '100%',
        },
        input: {
            flex: 1,
            paddingLeft: 10,
        },
        icon: {
            marginLeft: 10,
        },
    });

    return (
        <View style={styles.container}>
          <Product navigation={navigation}/>
        </View>
    );
};

export default Home;
