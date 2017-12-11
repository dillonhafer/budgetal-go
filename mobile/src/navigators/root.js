import React from 'react';
import { StackNavigator } from 'react-navigation';

// Naviagators
import AppTabNavigator from 'navigators/AppTab';

// Screens
import MainScreen from 'screens/Main';
import SignInScreen from 'screens/SignIn';
import RegisterScreen from 'screens/Register';

const RootNavigator = StackNavigator(
  {
    Main: { screen: MainScreen },
    SignIn: {
      screen: SignInScreen,
      navigationOptions: ({ navigation }) => ({
        title: `Sign In`,
      }),
    },
    Register: {
      screen: RegisterScreen,
      navigationOptions: ({ navigation }) => ({
        title: `Register`,
      }),
    },
    App: { screen: AppTabNavigator },
  },
  {
    cardStyle: {
      backgroundColor: '#ececec',
    },
  },
);

export default RootNavigator;
