import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Alert } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const numColumns = 2;
const cardWidth = (width - (numColumns + 1) * 10) / numColumns;

const Product = ({ navigation }) => {
    const [restaurants, setRestaurants] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const fetchRestaurants = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) {
                navigation.navigate('Login');
                return;
            }
            const URL = 'https://instaeat.azurewebsites.net/api/Restaurant';
            const response = await axios.get(URL, {
                headers: {
                    Authorization: `${token}`
                }
            });
            setRestaurants(response.data.items);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching restaurants:', error);
            setError(error.message); 
            setLoading(false); // Set loading to false even on error
            Alert.alert('Error', 'Failed to fetch restaurants. Please try again.');
        } 
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            padding: 10,
            backgroundColor: '#f8f8f8',
        },
        card: {
            width: cardWidth,
            height: 250,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: '#000', // Màu đen
            padding: 10,
            margin: 5,
            backgroundColor: '#fff',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.8,
            shadowRadius: 2,
            elevation: 1,
            justifyContent: 'center',
            marginRight:4,
            marginLeft:2
        },
        image: {
            width: '100%',
            height: 150,
            borderRadius: 10,
        },
        title: {
            fontSize: 18,
            fontWeight: 'bold',
            marginVertical: 10,
            textAlign: 'center',
        },
        TitleRestaurant: {
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 10,
            textAlign: 'center',
        },
        description: {
            textAlign: 'center',
        },
    });

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Detail', { restaurantId: item.restaurantId })}>
            <Image style={styles.image} source={require('../../../assets/images/background.jpg')} />
            <Text style={styles.title}>{item.restaurantName}</Text>
            <Text style={styles.description}>{item.address}</Text>
        </TouchableOpacity>
    );

    if (loading) {
        return <Text>Loading...</Text>;
    }

    if (error) {
        return <Text>Error: {error}</Text>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.TitleRestaurant}>Danh sách nhà hàng:</Text>
            <FlatList
                data={restaurants}
                renderItem={renderItem}
                keyExtractor={(item) => item.restaurantId.toString()}
                contentContainerStyle={{ paddingBottom: 20 }}
                numColumns={numColumns}
            />
        </View>
    );
};

export default Product;
