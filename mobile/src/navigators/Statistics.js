import React from 'react';
import { View } from 'react-native';
import { StackNavigator } from 'react-navigation';

import TabletNavigator from './TabletNavigator';

// Screens
import StatisticsScreen from 'screens/statistics/Statistics';
import MonthlyChartScreen from 'screens/statistics/MonthlyChart';

import { Ionicons } from '@expo/vector-icons';

const headerStyle = {
  height: 44,
};
const sidebarHeaderStyle = {
  height: 43.5,
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
    },
  },
);

const StatisticsSidebarNavigatorStack = StackNavigator(
  {
    MonthlyChart: {
      screen: MonthlyChartScreen,
      navigationOptions: ({ navigation }) => {
        return {
          headerStyle: sidebarHeaderStyle,
          title: `Chart View`,
        };
      },
    },
  },
  {
    cardStyle: {
      shadowOpacity: 0,
    },
  },
);

class StatisticsNavigator extends TabletNavigator {
  MainNavigator = AccountNavigatorStack;
  SideNavigator = StatisticsSidebarNavigatorStack;

  static navigationOptions = {
    header: null,
    tabBarLabel: 'Statistics',
    tabBarIcon: ({ tintColor }) => (
      <Ionicons name="md-stats" size={32} color={tintColor} />
    ),
  };
}

export default StatisticsNavigator;
