import React from 'react';
import { View, Text } from 'react-native';
import { StackNavigator } from 'react-navigation';

import TabletNavigator from 'navigators/TabletNavigator';

// Screens
import AnnualBudgetsScreen from 'screens/annual-budgets/AnnualBudgets';
import NewAnnualBudgetItemScreen from 'screens/annual-budgets/NewAnnualBudgetItem';
import EditAnnualBudgetItemScreen from 'screens/annual-budgets/EditAnnualBudgetItem';
import AnnualBudgetItemProgressScreen from 'screens/annual-budgets/AnnualBudgetItemProgress';

import {
  NavigationHeight,
  BlurViewNavigationOptions,
  BurgerNavigationOptions,
  drawerIcon,
} from 'utils/navigation-helpers';

const headerStyle = {
  height: NavigationHeight,
};

const AnnualBudgetNavigatorStack = StackNavigator(
  {
    AnnualBudget: {
      screen: AnnualBudgetsScreen,
      path: 'annual-budgets/:year',
      navigationOptions: ({ navigation }) => {
        const year =
          (navigation.state.params && navigation.state.params.year) ||
          new Date().getFullYear();

        return {
          gesturesEnabled: false,
          title: `Annual Budgets`,
          headerBackTitle: `${year}`,
          headerStyle,
          ...BurgerNavigationOptions,
        };
      },
    },
    AnnualBudgetProgress: {
      screen: AnnualBudgetItemProgressScreen,
      path: 'annual-budgets/:budgetItem',
      navigationOptions: () => ({
        title: 'Progress',
        headerStyle,
      }),
    },
    NewAnnualBudgetItem: {
      screen: NewAnnualBudgetItemScreen,
      path: 'newAnnualBudgetItem',
      navigationOptions: () => ({
        title: 'New Annual Item',
        headerStyle,
      }),
    },
    EditAnnualBudgetItem: {
      screen: EditAnnualBudgetItemScreen,
      path: 'editAnnualBudgetItem',
      navigationOptions: ({ navigation }) => ({
        title: `Edit ${navigation.state.params.annualBudgetItem.name}`,
        headerStyle,
      }),
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

const AnnualBudgetSidebarNavigatorStack = StackNavigator(
  {
    Main: {
      screen: View,
      navigationOptions: { header: null },
    },
    AnnualBudgetProgress: {
      screen: AnnualBudgetItemProgressScreen,
      path: 'annual-budgets/:budgetItem',
      navigationOptions: () => ({
        title: 'Progress',
        headerStyle,
      }),
    },
    NewAnnualBudgetItem: {
      screen: NewAnnualBudgetItemScreen,
      path: 'newAnnualBudgetItem',
      navigationOptions: () => ({
        title: 'New Annual Item',
        headerStyle,
      }),
    },
    EditAnnualBudgetItem: {
      screen: EditAnnualBudgetItemScreen,
      path: 'editAnnualBudgetItem',
      navigationOptions: ({ navigation }) => ({
        title: `Edit ${navigation.state.params.annualBudgetItem.name}`,
        headerStyle,
      }),
    },
  },
  { navigationOptions: BlurViewNavigationOptions },
);

class AnnualBudgetNavigator extends TabletNavigator {
  MainNavigator = AnnualBudgetNavigatorStack;
  SideNavigator = AnnualBudgetSidebarNavigatorStack;

  static navigationOptions = {
    // eslint-disable-next-line react/display-name
    drawerLabel: ({ tintColor }) => (
      <Text style={{ color: tintColor, fontWeight: 'bold' }}>
        ANNUAL BUDGETS
      </Text>
    ),
    // Width 32 Fix for react-navigation bugs
    // eslint-disable-next-line react/display-name
    drawerIcon: drawerIcon('md-calendar'),
  };
}

export default AnnualBudgetNavigator;
