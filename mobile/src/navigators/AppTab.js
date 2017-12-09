import React from 'react';
import { TabNavigator } from 'react-navigation';

// Screens
import BudgetsScreen from 'screens/Budgets';
import AccountScreen from 'screens/Account';

import colors from 'utils/colors';

const AppTabNavigator = TabNavigator(
  {
    Budgets: {
      screen: BudgetsScreen,
    },
    Account: {
      screen: AccountScreen,
    },
  },
  {
    tabBarPosition: 'bottom',
    animationEnabled: true,
    tabBarOptions: {
      activeTintColor: colors.primary,
    },
  },
);

export default AppTabNavigator;
