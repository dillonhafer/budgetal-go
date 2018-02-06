import React from 'react';
import { Platform } from 'react-native';
import { TabNavigator } from 'react-navigation';

// Navigators
import AccountNavigator from 'navigators/Account';
import BudgetNavigator from 'navigators/Budget';
import AnnualBudgetNavigator from 'navigators/AnnualBudget';
import StatisticsNavigator from 'navigators/Statistics';

import colors from 'utils/colors';
import Device from 'utils/Device';
import moment from 'moment';

const AppTabNavigator = TabNavigator(
  {
    Budgets: {
      screen: BudgetNavigator,
    },
    AnnualBudgets: {
      screen: AnnualBudgetNavigator,
    },
    Statistics: {
      screen: StatisticsNavigator,
    },
    Account: {
      screen: AccountNavigator,
    },
  },
  {
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: false,
    tabBarOptions: {
      showIcon: true,
      activeTintColor: colors.primary,
      inactiveTintColor: 'rgba(146, 146, 146, 1)',
      inactiveBackgroundColor: '#f7f7f7',
      labelStyle: {
        fontSize: Device.isTablet() ? 14 : 10,
      },
      style: {
        ...(Platform.OS === 'ios' ? { height: 49 } : { height: 58 }),
        ...(Device.isTablet() ? { height: 54 } : {}),
        backgroundColor: '#f7f7f7',
      },
      indicatorStyle: {
        backgroundColor: colors.primary,
      },
    },
  },
);
export default AppTabNavigator;
