import React from 'react';
import { Text } from 'react-native';
import { StackNavigator } from 'react-navigation';

import TabletNavigator from './TabletNavigator';

// Screens
import NetWorthScreen from 'screens/net-worth/NetWorth';
import MonthlyChartScreen from 'screens/statistics/MonthlyChart';

import {
  SidebarNavigationHeight,
  drawerIcon,
  BurgerNavigationOptions,
} from 'utils/navigation-helpers';
const sidebarHeaderStyle = {
  height: SidebarNavigationHeight,
  width: 300,
};

const NetWorthNavigatorStack = StackNavigator(
  {
    NetWorthScreen: {
      screen: NetWorthScreen,
      navigationOptions: () => ({
        title: 'Net Worth',
        ...BurgerNavigationOptions,
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
    MonthlyChart: {
      screen: MonthlyChartScreen,
      navigationOptions: () => {
        return {
          headerStyle: sidebarHeaderStyle,
          title: `NW - N/A`,
        };
      },
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
