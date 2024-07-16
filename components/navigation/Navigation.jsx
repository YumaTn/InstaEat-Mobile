import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Hoặc bất kỳ bộ biểu tượng nào bạn thích
import SCREENS from '../Screens/index.jsx';
import Home from '../Screens/Home.jsx';
import Notification from '../Screens/Notification.jsx';
import Profile from '../Screens/Profile.jsx';

const Tab = createBottomTabNavigator();

const Navigation = () => {
  return (
    <Tab.Navigator
    screenOptions={{
      tabBarLabelStyle: { color: 'black' }, 
      headerShown:false,
      tabBarStyle: {
        position: 'absolute',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        backgroundColor: '#ef4d2d',
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
        name={SCREENS.HOME}
        component={Home}
        options={{
          title: '',
          tabBarIcon: ({ focused }) => (
            <Icon name="home" size={30} color={focused ? 'white' : 'black'} />
          ),
        }}
      />
      <Tab.Screen
        name={SCREENS.NOTIFICATION}
        component={Notification}
        options={{
          title: '',
          tabBarIcon: ({ focused }) => (
            <Icon name="notifications" size={30} color={focused ? 'white' : 'black'} />
          ),
        }}
      />
      <Tab.Screen
        name={SCREENS.PROFILE}
        component={Profile}
        options={{
          title: '',
          tabBarIcon: ({ focused }) => (
            <Icon name="person" size={30} color={focused ? 'white' : 'black'} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
 
export default Navigation;
