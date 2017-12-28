import React, { PureComponent } from 'react';
import { StackNavigator } from 'react-navigation';

// Screens
import AccountScreen from 'screens/account/Account';
import AccountEditScreen from 'screens/account/AccountEdit';
import LegalScreen from 'screens/account/Legal';
import ChangePasswordScreen from 'screens/account/ChangePassword';
import SessionsScreen from 'screens/account/Sessions';

import { Ionicons } from '@expo/vector-icons';

const headerStyle = {
  height: 44,
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
    },
  },
);

class AccountNavigator extends PureComponent {
  static navigationOptions = {
    header: null,
    tabBarLabel: 'Account',
    tabBarIcon: ({ tintColor }) => (
      <Ionicons name="md-person" size={32} color={tintColor} />
    ),
  };

  render() {
    return (
      <AccountNavigatorStack
        screenProps={{ parentNavigation: this.props.navigation }}
      />
    );
  }
}

export default AccountNavigator;
