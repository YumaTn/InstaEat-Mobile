import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native-gesture-handler';

const { width } = Dimensions.get('window');
const numColumns = 2;
const cardWidth = (width - (numColumns + 1) * 10) / numColumns; // Adjust card width based on the number of columns and padding

export default function Product({ navigation }) {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getProducts = async () => {
            const URL = 'https://instaeat.azurewebsites.net/api/Restaurant';
            const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoidGVzdHJlc3RhdXJhbnQiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiIyIiwiZXhwIjoxNzIwMTEyNTEzfQ.paldGFEgydPgV9l597VlD7wSpYnDnpd6fHGEjdBzFMY';
            try {
                const response = await fetch(URL, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${TOKEN}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                setError(error.message);
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        getProducts();
    }, []);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            padding: 10,
            backgroundColor: '#f8f8f8',
        },
        card: {
            width: cardWidth,
            height: 250, // Fixed height for each card
            borderRadius: 10,
            padding: 10,
            margin: 5,
            backgroundColor: '#fff',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.8,
            shadowRadius: 2,
            elevation: 1,
            justifyContent: 'center', // Ensure content is centered
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
            textAlign: 'center', // Center text horizontally
        },
        TitleRestaurant: {
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 10,
            textAlign: 'center', // Center title horizontally
        },
        description: {
            textAlign: 'center', // Center description horizontally
        },
    });

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Detail')}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.description}>{item.description}</Text>
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
            <Text style={styles.TitleRestaurant}>Quán ăn:</Text>
            <FlatList
                data={products}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ paddingBottom: 20 }}
                numColumns={numColumns}
            />
        </View>
    );
}
