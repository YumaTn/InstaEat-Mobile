import { createStackNavigator } from '@react-navigation/stack';
import PlashScreen_1 from './PlashScreen/PlashScreen_1';
import { StyleSheet } from 'react-native';
import PlashScreen_2 from './PlashScreen/PlashScreen_2';
import PlashScreen_3 from './PlashScreen/PlashScreen_3';
import Navigation from '../navigation/Navigation';
import Login from './Login/Login';
import ProductDetails from '../Screens/Product/ProductDetails';
import Product from './Product/Product';
const Stack = createStackNavigator();

export default function App() {
    return (
        <Stack.Navigator
            style={styles.container}
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen
                name="Plash_1"
                component={PlashScreen_1} />
            <Stack.Screen
                name="Plash_2"
                component={PlashScreen_2} />
            <Stack.Screen
                name="Plash_3"
                component={PlashScreen_3} />
            <Stack.Screen
                name="Navigation"
                component={Navigation} />
            <Stack.Screen
                name="Login"
                component={Login} />
            <Stack.Screen
                name="Detail"
                component={ProductDetails} />
            <Stack.Screen
                name="Product"
                component={Product}/>
        </Stack.Navigator>
    );
}
const styles = StyleSheet.create({
    container: {
        position: 'absolute',
    },
}); 