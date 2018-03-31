import React from 'react';
import { StackNavigator } from 'react-navigation';

import TabletNavigator from './TabletNavigator';

// Screens
import StatisticsScreen from 'screens/statistics/Statistics';
import MonthlyChartScreen from 'screens/statistics/MonthlyChart';

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
    navigationOptions: BlurViewNavigationOptions,
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
    header: null,
    tabBarLabel: 'Statistics',
    // Width 32 Fix for react-navigation bugs
    // eslint-disable-next-line react/display-name
    tabBarIcon: ({ tintColor }) => (
      <Ionicons
        name="md-stats"
        style={{ width: 32, textAlign: 'center' }}
        size={32}
        color={tintColor}
      />
    ),
  };
}

export default StatisticsNavigator;
