import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';

// Screens
import AccountScreen from 'screens/Account';
import AccountEditScreen from 'screens/AccountEdit';
import LegalScreen from 'screens/Legal';
import ChangePasswordScreen from 'screens/ChangePassword';
import SessionsScreen from 'screens/Sessions';

import { Ionicons } from '@expo/vector-icons';

const AccountNavigatorStack = StackNavigator(
  {
    AccountScreen: { screen: AccountScreen },
    AccountEdit: { screen: AccountEditScreen, path: 'edit-account/:user' },
    ChangePassword: { screen: ChangePasswordScreen },
    Sessions: { screen: SessionsScreen },
    Legal: { screen: LegalScreen },
  },
  {
    cardStyle: {
      backgroundColor: '#ececec',
    },
  },
);

class AccountNavigator extends Component {
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
