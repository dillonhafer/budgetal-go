import React from 'react';
import { StackNavigator } from 'react-navigation';
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
  SidebarNavigationHeight,
  drawerIcon,
  BurgerNavigationOptions,
  BlurViewNavigationOptions,
} from 'utils/navigation-helpers';
const sidebarHeaderStyle = {
  height: SidebarNavigationHeight,
  width: 300,
};
const headerStyle = {
  height: NavigationHeight,
};

const NetWorthNavigatorStack = StackNavigator(
  {
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
        headerTitle: (
          <HeaderText>NEW {navigation.getParam('title')}</HeaderText>
        ),
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
  },
  {
    cardStyle: {
      backgroundColor: '#ececec',
      shadowOpacity: 0,
    },
  },
);

const NetWorthSidebarNavigatorStack = StackNavigator(
  {
    MonthListScreen: {
      screen: MonthListScreen,
      navigationOptions: screenProps => ({
        headerStyle: sidebarHeaderStyle,
        title: `${screenProps.month.name} 2019`,
        ...BurgerNavigationOptions,
      }),
    },
  },
  {},
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
