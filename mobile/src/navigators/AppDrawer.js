import { DrawerNavigator } from 'react-navigation';
import { StatusBar } from 'react-native';

// Navigators
import DrawerContent from './DrawerContent';
import AccountNavigator from 'navigators/Account';
import BudgetNavigator from 'navigators/Budget';
import AnnualBudgetNavigator from 'navigators/AnnualBudget';
import StatisticsNavigator from 'navigators/Statistics';

import colors from 'utils/colors';

const AppDrawerNavigator = DrawerNavigator(
  {
    Budgets: {
      screen: BudgetNavigator,
      navigationOptions: {
        drawer: {
          label: 'Mom',
        },
      },
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
    drawerBackgroundColor: colors.primary,
    contentComponent: DrawerContent,
    contentOptions: {
      activeBackgroundColor: '#2eb1fc',
      activeTintColor: '#fff',
      inactiveTintColor: '#fff',
    },
  },
);

const defaultGetStateForAction = AppDrawerNavigator.router.getStateForAction;
AppDrawerNavigator.router.getStateForAction = (action, state) => {
  if (
    state &&
    action.type === 'Navigation/NAVIGATE' &&
    action.routeName === 'DrawerClose'
  ) {
    StatusBar.setBarStyle('default', true);
  }

  return defaultGetStateForAction(action, state);
};

export default AppDrawerNavigator;
