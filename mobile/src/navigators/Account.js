import React, { PureComponent } from 'react';
import { View, StyleSheet } from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';

// Utils
import Device from 'utils/Device';
const isTablet = Device.isTablet();
import colors from 'utils/colors';

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
const sidebarHeaderStyle = {
  height: 43,
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
      shadowOpacity: 0,
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

  state = {
    activeSidebarScreen: '',
  };

  renderSideItem = () => {
    if (isTablet) {
      return (
        <View style={styles.sidebarContainer}>
          <AccountSidebarNavigatorStack
            ref={sidebar => {
              this.sidebar = sidebar;
            }}
          />
        </View>
      );
    } else {
      return null;
    }
  };

  sidebarNavigate = (routeName, params = {}) => {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName,
          params,
        }),
      ],
    });
    this.sidebar.dispatch(resetAction);
  };

  layoutNavigate = (routeName, params) => {
    if (isTablet) {
      this.setState({ activeSidebarScreen: routeName });
      this.sidebarNavigate(routeName, params);
    } else {
      this.main._navigation.navigate(routeName, params);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.mainContainer}>
          <AccountNavigatorStack
            ref={main => {
              this.main = main;
            }}
            screenProps={{
              activeSidebarScreen: this.state.activeSidebarScreen,
              layoutNavigate: this.layoutNavigate,
              parentNavigation: this.props.navigation,
            }}
          />
        </View>
        {this.renderSideItem()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    ...(isTablet ? { flexDirection: 'row' } : {}),
  },
  mainContainer: {
    flex: 1,
    ...(isTablet ? { maxWidth: '35%' } : {}),
  },
  sidebarContainer: {
    flex: 1,
    backgroundColor: colors.background,
    borderWidth: 0.5,
    borderColor: 'transparent',
    borderLeftColor: colors.lines,
  },
});

export default AccountNavigator;
