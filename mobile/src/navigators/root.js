import React from 'react';
// Naviagators
import { StackNavigator } from 'react-navigation';
import AppDrawerNavigator from 'navigators/AppDrawer';

// Screens
import MainScreen from 'screens/Main';
import SignInScreen from 'screens/SignIn';
import ForgotPasswordScreen from 'screens/ForgotPassword';
import ResetPasswordScreen from 'screens/ResetPassword';
import RegisterScreen from 'screens/Register';

import { HeaderText } from 'components/Text';
import { NavigationHeight } from 'utils/navigation-helpers';
const headerStyle = {
  height: NavigationHeight,
};

const RootNavigator = StackNavigator(
  {
    Main: { screen: MainScreen },
    SignIn: {
      screen: SignInScreen,
      navigationOptions: () => ({
        title: `Sign In`,
        headerStyle,
      }),
    },
    ForgotPassword: {
      screen: ForgotPasswordScreen,
      navigationOptions: () => ({
        headerTitle: <HeaderText numberOfLines={1}>FORGOT PASSWORD</HeaderText>,
        headerStyle,
      }),
    },
    Register: {
      screen: RegisterScreen,
      navigationOptions: () => ({
        headerTitle: <HeaderText>REGISTER</HeaderText>,
        headerStyle,
      }),
    },
    App: {
      screen: AppDrawerNavigator,
      navigationOptions: {
        header: null,
      },
    },
    ResetPassword: {
      screen: ResetPasswordScreen,
      path: 'reset-password/:resetPasswordToken',
      navigationOptions: () => ({
        headerTitle: <HeaderText>RESET PASSWORD</HeaderText>,
        headerStyle,
      }),
    },
  },
  {
    cardStyle: {
      backgroundColor: '#ececec',
    },
    headerMode: 'screen',
  },
);

export default RootNavigator;
