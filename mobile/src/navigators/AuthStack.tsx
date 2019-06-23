import { HeaderText } from "@src/components/Text";
import ForgotPasswordScreen from "@src/screens/AuthStack/ForgotPassword";
import RegisterScreen from "@src/screens/AuthStack/Register";
import ResetPasswordScreen from "@src/screens/AuthStack/ResetPassword";
import SignInScreen from "@src/screens/AuthStack/SignIn";
import { NavigationHeight } from "@src/utils/navigation-helpers";
import React from "react";
import { createStackNavigator } from "react-navigation";

const headerStyle = {
  height: NavigationHeight,
};

const AuthStack = createStackNavigator({
  SignIn: {
    screen: SignInScreen,
    navigationOptions: () => ({
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
  ResetPassword: {
    screen: ResetPasswordScreen,
    path: "reset-password",
    navigationOptions: () => ({
      headerTitle: <HeaderText>RESET PASSWORD</HeaderText>,
      headerStyle,
    }),
  },
});

export default AuthStack;
