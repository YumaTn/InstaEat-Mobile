import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet } from 'react-native';
import PlashScreen from './PlashScreen/PlashScreen';
import Navigation from '../navigation/Navigation';
import Login from './Login/Login';
import ProductDetails from '../Screens/Product/ProductDetails';
import Product from './Product/Product';
import Signup from '../Screens/Login/Signup';
import Home from './Home';
import UpdateToRestaurant from '../Screens/Restaurant/UpdateToRestaurant';
import Wallet from './Wallet/Wallet';
import ShopPointScreen from '../Screens/PackagePay/ShopPointScreen';
import Review from '../Screens/Product/Review';
import RestaurantAccept from '../Screens/Restaurant/RestaurantAccept';
import NavigationRestaurant from '../navigation/NavigationRestaurant';
import EditUser from '../Screens/EditUser';
import Password from '../Screens/Password';
import EditRestaurant from '../Screens/Restaurant/EditRestaurant';
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
                name="Plash_3"
                component={PlashScreen} />
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
                <Stack.Screen
                name="SignUp"
                component={Signup}/>
                <Stack.Screen
                name="Home"
                component={Home}/>
                <Stack.Screen
                name="UpdateToRestaurant"
                component={UpdateToRestaurant}/>
                <Stack.Screen
                name="Wallet"
                component={Wallet}/>
                <Stack.Screen
                name="RNavigation"
                component={NavigationRestaurant}/>
                <Stack.Screen
                name="ShopPoint"
                component={ShopPointScreen}/>
                <Stack.Screen
                name="Review"
                component={Review}/>
                <Stack.Screen
                name="RAccept"
                component={RestaurantAccept}/>
                <Stack.Screen
                name="EditUser"
                component={EditUser}/>
                <Stack.Screen
                name="Password"
                component={Password}/>
                <Stack.Screen
                name="EditRestaurant"
                component={EditRestaurant}/>
        </Stack.Navigator>
    );
}
const styles = StyleSheet.create({
    container: {
        position: 'absolute',
    },
}); 