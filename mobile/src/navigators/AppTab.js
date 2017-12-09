import React from 'react';
import { TabNavigator } from 'react-navigation';

// Navigators
import AccountNavigator from 'navigators/Account';
import BudgetNavigator from 'navigators/Budget';

// Screens
import StatisticsScreen from 'screens/Statistics';
import AnnualBudgetsScreen from 'screens/AnnualBudgets';

import colors from 'utils/colors';

const AppTabNavigator = TabNavigator(
  {
    Budgets: {
      screen: BudgetNavigator,
    },
    AnnualBudgets: {
      screen: AnnualBudgetsScreen,
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
