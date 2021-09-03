import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen';
import TokenRegister from '../screens/TokenRegisterScreen';

const MainStack = createStackNavigator();

const MainStackNavigator = ({navigation}) => {
    return(
        <MainStack.Navigator
           screenOptions = {{headerShown: false}}
        >
            <MainStack.Screen name='Register' component= {TokenRegister}/>
            <MainStack.Screen name='Home' component= {HomeScreen}/>         
        </MainStack.Navigator>
    )
}

export default MainStackNavigator;