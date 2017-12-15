import React from 'react';
import { TabNavigator } from 'react-navigation';

// Navigators
import AccountNavigator from 'navigators/Account';
import BudgetNavigator from 'navigators/Budget';
import AnnualBudgetNavigator from 'navigators/AnnualBudget';

// Screens
import StatisticsScreen from 'screens/statistics/Statistics';

import colors from 'utils/colors';
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
      screen: StatisticsScreen,
    },
    Account: {
      screen: AccountNavigator,
    },
  },
  {
    tabBarPosition: 'bottom',
    animationEnabled: false,
    tabBarOptions: {
      activeTintColor: colors.primary,
    },
  },
);
export default AppTabNavigator;
