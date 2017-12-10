import React from 'react';
import { TabNavigator } from 'react-navigation';

// Navigators
import AccountNavigator from 'navigators/Account';
import BudgetNavigator from 'navigators/Budget';

// Screens
import StatisticsScreen from 'screens/Statistics';
import AnnualBudgetsScreen from 'screens/AnnualBudgets';

import colors from 'utils/colors';
import moment from 'moment';

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
      path: 'budgets/:year/:month',
      navigationOptions: ({ navigation }) => {
        const year =
          (navigation.state.params && navigation.state.params.year) ||
          new Date().getFullYear();
        const month =
          (navigation.state.params && navigation.state.params.month) ||
          new Date().getMonth() + 1;

        const budgetDate = moment(`${year}-${month}-01`, 'YYYY-MM-DD');
        const title = budgetDate.format('MMMM, YYYY');
        return {
          title,
          tabBarLabel: 'Statistics',
        };
      },
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
