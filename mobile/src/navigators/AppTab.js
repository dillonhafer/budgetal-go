import React from 'react';
import { Platform } from 'react-native';
import { TabNavigator } from 'react-navigation';

// Navigators
import AccountNavigator from 'navigators/Account';
import BudgetNavigator from 'navigators/Budget';
import AnnualBudgetNavigator from 'navigators/AnnualBudget';

// Screens
import StatisticsScreen from 'screens/statistics/Statistics';

import colors from 'utils/colors';
import moment from 'moment';

const headerStyle = {
  height: 44,
};

const AppTabNavigator = TabNavigator(
  {
    Budgets: {
      screen: BudgetNavigator,
    },
    AnnualBudgets: {
      screen: AnnualBudgetNavigator,
    },
    Statistics: {
      screen: StatisticsScreen,
      navigationOptions: ({ navigation }) => ({
        headerStyle,
      }),
    },
    Account: {
      screen: AccountNavigator,
    },
  },
  {
    tabBarPosition: 'bottom',
    animationEnabled: false,
    tabBarOptions: {
      showIcon: true,
      activeTintColor: colors.primary,
      inactiveTintColor: 'rgba(146, 146, 146, 1)',
      inactiveBackgroundColor: '#f7f7f7',
      labelStyle: {
        fontSize: 10,
      },
      style: {
        ...(Platform.OS === 'ios' ? { height: 49 } : { height: 58 }),
        backgroundColor: '#f7f7f7',
      },
      indicatorStyle: {
        backgroundColor: colors.primary,
      },
    },
  },
);
export default AppTabNavigator;
