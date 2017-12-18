import React from 'react';
import { StackNavigator } from 'react-navigation';

// Naviagators
import AppTabNavigator from 'navigators/AppTab';

// Screens
import MainScreen from 'screens/Main';
import SignInScreen from 'screens/SignIn';
import ForgotPasswordScreen from 'screens/ForgotPassword';
import ResetPasswordScreen from 'screens/ResetPassword';
import RegisterScreen from 'screens/Register';

const headerStyle = {
  height: 44,
};

const RootNavigator = StackNavigator(
  {
    Main: { screen: MainScreen },
    SignIn: {
      screen: SignInScreen,
      navigationOptions: ({ navigation }) => ({
        title: `Sign In`,
        headerStyle,
      }),
    },
    ForgotPassword: {
      screen: ForgotPasswordScreen,
      navigationOptions: ({ navigation }) => ({
        title: `Forgot Password`,
        headerStyle,
      }),
    },
    Register: {
      screen: RegisterScreen,
      navigationOptions: ({ navigation }) => ({
        title: `Register`,
        headerStyle,
      }),
    },
    App: { screen: AppTabNavigator },
    ResetPassword: {
      screen: ResetPasswordScreen,
      path: 'reset-password/:resetPasswordToken',
      navigationOptions: ({ navigation }) => ({
        title: `Reset Password`,
        headerStyle,
      }),
    },
  },
  {
    cardStyle: {
      backgroundColor: '#ececec',
    },
  },
);

export default RootNavigator;
