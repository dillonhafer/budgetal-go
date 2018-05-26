// Naviagators
import { StackNavigator } from 'react-navigation';
import AppDrawerNavigator from 'navigators/AppDrawer';

// Screens
import MainScreen from 'screens/Main';
import SignInScreen from 'screens/SignIn';
import ForgotPasswordScreen from 'screens/ForgotPassword';
import ResetPasswordScreen from 'screens/ResetPassword';
import RegisterScreen from 'screens/Register';

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
        title: `Forgot Password`,
        headerStyle,
      }),
    },
    Register: {
      screen: RegisterScreen,
      navigationOptions: () => ({
        title: `Register`,
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
        title: `Reset Password`,
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
