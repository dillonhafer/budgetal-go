import React from 'react';
import { StackNavigator } from 'react-navigation';

// Naviagators
import AppTabNavigator from 'navigators/AppTab';

// Screens
import MainScreen from 'screens/Main';
import SignInScreen from 'screens/SignIn';
import ForgotPasswordScreen from 'screens/ForgotPassword';
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
    ForgotPassword: {
      screen: ForgotPasswordScreen,
      navigationOptions: ({ navigation }) => ({
        title: `Forgot Password`,
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
