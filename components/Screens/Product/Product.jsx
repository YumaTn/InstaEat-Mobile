import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native-gesture-handler';

export default function Product({ navigation }) {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [numColumns, setNumColumns] = useState(2);

    useEffect(() => {
        const getProducts = async () => {
            const URL = 'https://665d20c5e88051d60405794a.mockapi.io/Product';
            try {
                const response = await fetch(URL);
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
            flex: 1,
            borderRadius: 10,
            padding: 10,
            margin: 5,
            backgroundColor: '#fff',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.8,
            shadowRadius: 2,
            elevation: 1,
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
        },
    });

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Detail')}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.title}>{item.name}</Text>
            <Text>{item.description}</Text>
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
                key={numColumns}
            />
        </View>
    );
}
