import React from 'react';
import { Text } from 'react-native';
import { StackNavigator } from 'react-navigation';

import TabletNavigator from './TabletNavigator';

// Screens
import StatisticsScreen from 'screens/statistics/Statistics';
import MonthlyChartScreen from 'screens/statistics/MonthlyChart';

import {
  NavigationHeight,
  SidebarNavigationHeight,
  BlurViewNavigationOptions,
  BurgerNavigationOptions,
  drawerIcon,
} from 'utils/navigation-helpers';
const headerStyle = {
  height: NavigationHeight,
};
const sidebarHeaderStyle = {
  height: SidebarNavigationHeight,
};

const AccountNavigatorStack = StackNavigator(
  {
    Statistics: {
      screen: StatisticsScreen,
      navigationOptions: { headerStyle },
    },
  },
  {
    cardStyle: {
      backgroundColor: '#ececec',
      shadowOpacity: 0,
    },
    navigationOptions: {
      ...BlurViewNavigationOptions,
      ...BurgerNavigationOptions,
    },
  },
);

const StatisticsSidebarNavigatorStack = StackNavigator(
  {
    MonthlyChart: {
      screen: MonthlyChartScreen,
      navigationOptions: () => {
        return {
          headerStyle: sidebarHeaderStyle,
          title: `Chart View`,
        };
      },
    },
  },
  {},
);

class StatisticsNavigator extends TabletNavigator {
  MainNavigator = AccountNavigatorStack;
  SideNavigator = StatisticsSidebarNavigatorStack;

  static navigationOptions = {
    // eslint-disable-next-line react/display-name
    drawerLabel: ({ tintColor }) => (
      <Text style={{ color: tintColor, fontWeight: 'bold' }}>STATISTICS</Text>
    ),
    drawerIcon: drawerIcon('md-stats'),
  };
}

export default StatisticsNavigator;
