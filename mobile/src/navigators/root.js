import React from 'react';
// Naviagators
import {
  createStackNavigator,
  createAppContainer,
  createSwitchNavigator,
} from 'react-navigation';

import AppDrawerNavigator from '@src/navigators/AppDrawer';

// Screens
import SignInScreen from '@src/screens/SignIn';
import ForgotPasswordScreen from '@src/screens/ForgotPassword';
import ResetPasswordScreen from '@src/screens/ResetPassword';
import RegisterScreen from '@src/screens/Register';

import { HeaderText } from '@src/components/Text';
import { NavigationHeight } from '@src/utils/navigation-helpers';
import AuthLoadingScreen from '@src/screens/AuthLoading';
const headerStyle = {
  height: NavigationHeight,
};

const SignInStack = createStackNavigator({
  SignIn: {
    screen: SignInScreen,
    navigationOptions: () => ({
      title: `Sign In`,
      headerStyle,
      header: null,
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
});

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      SignIn: SignInStack,
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
      initialRouteName: 'AuthLoading',
    },
  ),
);
