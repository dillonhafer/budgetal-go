import React from 'react';
import { View } from 'react-native';
import { StackNavigator } from 'react-navigation';

import TabletNavigator from './TabletNavigator';
import colors from 'utils/colors';

// Screens
import AccountScreen from 'screens/account/Account';
import AccountEditScreen from 'screens/account/AccountEdit';
import LegalScreen from 'screens/account/Legal';
import ChangePasswordScreen from 'screens/account/ChangePassword';
import SessionsScreen from 'screens/account/Sessions';

import { Ionicons } from '@expo/vector-icons';
import {
  NavigationHeight,
  SidebarNavigationHeight,
  BlurViewNavigationOptions,
} from 'utils/navigation-helpers';

const headerStyle = {
  height: NavigationHeight,
};
const sidebarHeaderStyle = {
  height: SidebarNavigationHeight,
};

const AccountNavigatorStack = StackNavigator(
  {
    AccountScreen: {
      screen: AccountScreen,
      navigationOptions: {
        headerStyle,
        headerLeft: null,
        gesturesEnabled: false,
      },
    },
    AccountEdit: {
      screen: AccountEditScreen,
      path: 'edit-account/:user',
      navigationOptions: { headerStyle },
    },
    ChangePassword: {
      screen: ChangePasswordScreen,
      navigationOptions: { headerStyle },
    },
    Sessions: { screen: SessionsScreen, navigationOptions: { headerStyle } },
    Legal: { screen: LegalScreen, navigationOptions: { headerStyle } },
  },
  {
    cardStyle: {
      backgroundColor: '#ececec',
      shadowOpacity: 0,
    },
    navigationOptions: BlurViewNavigationOptions,
  },
);

const AccountSidebarNavigatorStack = StackNavigator(
  {
    Main: {
      screen: View,
      navigationOptions: { header: null },
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
      path: 'edit-account/:user',
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
  },
);

class AccountNavigator extends TabletNavigator {
  MainNavigator = AccountNavigatorStack;
  SideNavigator = AccountSidebarNavigatorStack;

  static navigationOptions = {
    header: null,
    tabBarLabel: 'Account',
    // Width 32 Fix for react-navigation bugs
    // eslint-disable-next-line react/display-name
    tabBarIcon: ({ tintColor }) => (
      <Ionicons
        name="md-person"
        style={{ width: 32 }}
        size={32}
        color={tintColor}
      />
    ),
  };
}

export default AccountNavigator;
