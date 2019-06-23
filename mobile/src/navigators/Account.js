import React from "react";
import { View, Text } from "react-native";
import { createStackNavigator } from "react-navigation";

import TabletNavigator from "./TabletNavigator";
import { colors } from "@shared/theme";
import { HeaderText } from "@src/components/Text";

// Screens
import AccountScreen from "@src/screens/account/Account";
import AccountEditScreen from "@src/screens/account/AccountEdit";
import LegalScreen from "@src/screens/account/Legal";
import ChangePasswordScreen from "@src/screens/account/ChangePassword";
import SessionsScreen from "@src/screens/account/Sessions";

import {
  NavigationHeight,
  SidebarNavigationHeight,
  BlurViewNavigationOptions,
  BurgerNavigationOptions,
  drawerIcon,
} from "@src/utils/navigation-helpers";

const headerStyle = {
  height: NavigationHeight,
};
const sidebarHeaderStyle = {
  height: SidebarNavigationHeight,
};

const AccountNavigatorStack = createStackNavigator(
  {
    AccountScreen: {
      screen: AccountScreen,
      navigationOptions: {
        headerStyle,
        headerTitle: <HeaderText>ACCOUNT SETTINGS</HeaderText>,
        headerBackTitle: "",
        gesturesEnabled: false,
        ...BurgerNavigationOptions,
      },
    },
    AccountEdit: {
      screen: AccountEditScreen,
      path: "edit-account/:user",
      navigationOptions: {
        headerStyle,
        headerTitle: <HeaderText>ACCOUNT EDIT</HeaderText>,
      },
    },
    ChangePassword: {
      screen: ChangePasswordScreen,
      navigationOptions: {
        headerStyle,
        headerTitle: <HeaderText>CHANGE PASSWORD</HeaderText>,
      },
    },
    Sessions: {
      screen: SessionsScreen,
      navigationOptions: {
        headerStyle,
        headerTitle: <HeaderText>SESSIONS</HeaderText>,
      },
    },
  },
  {
    cardStyle: {
      backgroundColor: "#ececec",
      shadowOpacity: 0,
    },
    navigationOptions: BlurViewNavigationOptions,
  }
);

const AccountSidebarNavigatorStack = createStackNavigator(
  {
    Main: {
      screen: View,
    },
    Legal: {
      screen: LegalScreen,
      navigationOptions: { headerStyle: sidebarHeaderStyle },
    },
    Sessions: {
      screen: SessionsScreen,
      navigationOptions: { headerStyle: sidebarHeaderStyle },
    },
    AccountEdit: {
      screen: AccountEditScreen,
      path: "edit-account/:user",
      navigationOptions: { headerStyle: sidebarHeaderStyle },
    },
    ChangePassword: {
      screen: ChangePasswordScreen,
      navigationOptions: { headerStyle: sidebarHeaderStyle },
    },
  },
  {
    cardStyle: {
      backgroundColor: colors.background,
    },
    navigationOptions: BlurViewNavigationOptions,
  }
);

class AccountNavigator extends TabletNavigator {
  MainNavigator = AccountNavigatorStack;
  SideNavigator = AccountSidebarNavigatorStack;

  static navigationOptions = {
    contentOptions: {
      labelStyle: { margin: 0 },
    },
    // eslint-disable-next-line react/display-name
    drawerLabel: ({ tintColor }) => (
      <Text style={{ color: tintColor, fontWeight: "bold" }}>ACCOUNT</Text>
    ),
    drawerIcon: drawerIcon("md-person"),
  };
}

export default AccountNavigatorStack;
