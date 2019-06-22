import React from 'react';
import { View } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { HeaderText, BudgetalText } from 'components/Text';

import TabletNavigator from './TabletNavigator';

// Screens
import NetWorthScreen from 'screens/net-worth';
import MonthListScreen from 'screens/net-worth/MonthList';
import NewMonthItemScreen from 'screens/net-worth/NewMonthItem';
import EditMonthItemScreen from 'screens/net-worth/EditMonthItem';
import NewAssetLiabilityScreen from 'screens/net-worth/NewAssetLiability';
import EditAssetLiabilityScreen from 'screens/net-worth/EditAssetLiability';

import {
  NavigationHeight,
  drawerIcon,
  BurgerNavigationOptions,
  BlurViewNavigationOptions,
} from 'utils/navigation-helpers';
const headerStyle = {
  height: NavigationHeight,
};

const screens = {
  NetWorthScreen: {
    screen: NetWorthScreen,
    navigationOptions: () => ({
      headerTitle: <HeaderText>NET WORTH</HeaderText>,
      ...BurgerNavigationOptions,
      ...BlurViewNavigationOptions,
    }),
  },
  MonthListScreen: {
    screen: MonthListScreen,
    navigationOptions: ({ navigation }) => ({
      headerTitle: (
        <HeaderText>
          {navigation.getParam('month').label.toUpperCase()}{' '}
          {navigation.getParam('year')}
        </HeaderText>
      ),
      headerStyle,
      ...BlurViewNavigationOptions,
    }),
  },
  EditMonthItemScreen: {
    screen: EditMonthItemScreen,
    navigationOptions: ({ navigation }) => ({
      headerTitle: (
        <HeaderText>
          EDIT {navigation.getParam('item').name.toUpperCase()}
        </HeaderText>
      ),
      headerStyle,
      ...BlurViewNavigationOptions,
    }),
  },
  NewMonthItemScreen: {
    screen: NewMonthItemScreen,
    navigationOptions: ({ navigation }) => ({
      headerTitle: (
        <HeaderText>
          NEW {navigation.getParam('title').toUpperCase()}
        </HeaderText>
      ),
      headerStyle,
      ...BlurViewNavigationOptions,
    }),
  },
  NewAssetLiabilityScreen: {
    screen: NewAssetLiabilityScreen,
    navigationOptions: ({ navigation }) => ({
      headerTitle: <HeaderText>NEW {navigation.getParam('title')}</HeaderText>,
      headerStyle,
      ...BlurViewNavigationOptions,
    }),
  },
  EditAssetLiabilityScreen: {
    screen: EditAssetLiabilityScreen,
    navigationOptions: ({ navigation }) => ({
      headerTitle: (
        <HeaderText>
          EDIT {navigation.getParam('item').name.toUpperCase()}
        </HeaderText>
      ),
      headerStyle,
      ...BlurViewNavigationOptions,
    }),
  },
};

const NetWorthNavigatorStack = createStackNavigator(
  { ...screens },
  {
    cardStyle: {
      backgroundColor: '#ececec',
      shadowOpacity: 0,
    },
  },
);

const NetWorthSidebarNavigatorStack = createStackNavigator(
  {
    Main: {
      screen: View,
      navigationOptions: { header: null },
    },
    ...screens,
  },
  {
    cardStyle: {
      shadowOpacity: 0,
    },
    navigationOptions: BlurViewNavigationOptions,
  },
);

class NetWorthNavigator extends TabletNavigator {
  MainNavigator = NetWorthNavigatorStack;
  SideNavigator = NetWorthSidebarNavigatorStack;

  static navigationOptions = {
    // eslint-disable-next-line react/display-name
    drawerLabel: ({ tintColor }) => (
      <BudgetalText style={{ color: tintColor }}>NET WORTH</BudgetalText>
    ),
    drawerIcon: drawerIcon('md-trending-up'),
  };
}

export default NetWorthNavigator;
