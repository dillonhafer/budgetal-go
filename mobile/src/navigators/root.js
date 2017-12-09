import React from 'react';
import { StackNavigator } from 'react-navigation';

// Naviagators
import AppTabNavigator from 'navigators/AppTab';

// Screens
import MainScreen from 'screens/Main';
import SignInScreen from 'screens/SignIn';

const RootNavigator = StackNavigator(
  {
    Main: { screen: MainScreen },
    SignIn: { screen: SignInScreen },
    App: { screen: AppTabNavigator },
  },
  {
    cardStyle: {
      backgroundColor: '#ececec',
    },
  },
);

export default RootNavigator;
