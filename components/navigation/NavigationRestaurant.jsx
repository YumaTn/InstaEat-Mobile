import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Hoặc bất kỳ bộ biểu tượng nào bạn thích
import SCREENS from '../Screens/index.jsx';
import Home from '../Screens/Home.jsx';
import Notification from '../Screens/Notification.jsx';
import Profile from '../Screens/Profile.jsx';
import RestaurantHome from '../Screens/Restaurant/RestaurantHome.jsx';
import RestaurantProfile from '../Screens/Restaurant/RestaurantProfile.jsx';
import RestaurantNotification from '../Screens/Restaurant/RestaurantNotification.jsx';
const Tab = createBottomTabNavigator();

const RestaurantNavigation = (route ) => {
  return (
    <Tab.Navigator
    screenOptions={{
      tabBarLabelStyle: { color: 'black' }, 
      headerShown:false,
      tabBarStyle: {
        position: 'absolute',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        backgroundColor: 'purple',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
    }}
    >
      <Tab.Screen
        name={SCREENS.RESTAURANTHOME}
        component={RestaurantHome}
        options={{
          title: '',
          tabBarIcon: ({ focused }) => (
            <Icon name="restaurant" size={30} color={focused ? 'black' : 'white'} />
          ),
        }}
      />
      <Tab.Screen
        name={SCREENS.RESTAURANTNOTIFICATION}
        component={RestaurantNotification}
        options={{
          title: '',
          tabBarIcon: ({ focused }) => (
            <Icon name="notifications" size={30} color={focused ? 'black' : 'white'} />
          ),
        }}
      />
      <Tab.Screen
        name={SCREENS.RESTAURANTPROFILE}
        component={RestaurantProfile}
        options={{
          title: '',
          tabBarIcon: ({ focused }) => (
            <Icon name="person" size={30} color={focused ? 'black' : 'white'} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default RestaurantNavigation;
