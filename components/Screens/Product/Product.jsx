import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Alert, ActivityIndicator, TextInput } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const numColumns = 2;
const cardWidth = (width - (numColumns + 1) * 10) / numColumns;

const Product = ({ navigation }) => {
    const [restaurants, setRestaurants] = useState([]);
    const [displayRestaurants, setDisplayRestaurants] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [originalRestaurants, setOriginalRestaurants] = useState([]);

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
            const fetchedRestaurants = response.data.items;
            setRestaurants(fetchedRestaurants);
            setOriginalRestaurants(fetchedRestaurants);
            setDisplayRestaurants(fetchedRestaurants); // Lưu cả danh sách gốc và hiển thị
            setLoading(false);
        } catch (error) {
            console.error('Error fetching restaurants:', error);
            setError(error.message); 
            setLoading(false); // Set loading to false even on error
            Alert.alert('Error', 'Failed to fetch restaurants. Please try again.');
        } 
    };

    const searchRestaurants = (text) => {
        setSearchQuery(text);
        const filteredRestaurants = originalRestaurants.filter(item =>
            item.restaurantName.toLowerCase().includes(text.toLowerCase())
        );
        setDisplayRestaurants(filteredRestaurants.length > 0 ? filteredRestaurants : displayRestaurants);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Detail', { restaurantId: item.restaurantId })}>
            <Image style={styles.image} source={require('../../../assets/images/background.jpg')} />
            <Text style={styles.title}>{truncateText(item.restaurantName, 20)}</Text>
            <Text style={styles.description}>{truncateText(item.address, 30)}</Text>
        </TouchableOpacity>
    );
    
    const truncateText = (text, maxLength) => {
        if (text.length > maxLength) {
            return text.substring(0, maxLength - 3) + '...';
        } else {
            return text;
        }
    };
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#ef4d2d" />
            </View>
        );
    }

    if (error) {
        return <Text>Error: {error}</Text>;
    }

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <View style={styles.searchContainer}>
                    <AntDesign name="search1" size={24} color="black" style={styles.icon} />
                    <TextInput
                        style={styles.searchInput}
                        onChangeText={searchRestaurants}
                        value={searchQuery}
                        placeholder="Tìm kiếm theo tên nhà hàng..."
                        placeholderTextColor="black"
                    />
                </View>
            </View>
            <FlatList
                data={displayRestaurants}
                renderItem={renderItem}
                keyExtractor={(item) => item.restaurantId.toString()}
                contentContainerStyle={{ paddingBottom: 20 }}
                numColumns={numColumns}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    card: {
        width: cardWidth,
        height: 320, 
        borderRadius: 10,
        borderColor: '#000', 
        margin: 5,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1,
        justifyContent: 'flex-start',
        alignItems: 'center', 
    },
    image: {
        width: '100%',
        height: '60%',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        resizeMode: 'cover', 
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 10,
        textAlign: 'center',
        paddingHorizontal: 10, // Để tránh tràn ra ngoài
    },
    description: {
        textAlign: 'center',
        paddingHorizontal: 10, // Để tránh tràn ra ngoài
        marginBottom: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    searchInput: {
        flex: 1,
        paddingLeft: 10,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#ef4d2d',
        paddingTop: 40,
        paddingBottom: 20,
        marginBottom:10,
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
});


export default Product;
