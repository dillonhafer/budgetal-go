import React from 'react';
import { View } from 'react-native';
import { StackNavigator } from 'react-navigation';

import TabletNavigator from 'navigators/TabletNavigator';

// Screens
import AnnualBudgetsScreen from 'screens/annual-budgets/AnnualBudgets';
import NewAnnualBudgetItemScreen from 'screens/annual-budgets/NewAnnualBudgetItem';
import EditAnnualBudgetItemScreen from 'screens/annual-budgets/EditAnnualBudgetItem';
import AnnualBudgetItemProgressScreen from 'screens/annual-budgets/AnnualBudgetItemProgress';

import { Ionicons } from '@expo/vector-icons';

const headerStyle = {
  height: 44,
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
          headerLeft: null,
          gesturesEnabled: false,
          title: `Annual Budgets`,
          headerBackTitle: `${year}`,
          headerStyle,
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
  {},
);

class AnnualBudgetNavigator extends TabletNavigator {
  MainNavigator = AnnualBudgetNavigatorStack;
  SideNavigator = AnnualBudgetSidebarNavigatorStack;

  static navigationOptions = {
    header: null,
    tabBarLabel: 'Annual',
    // eslint-disable-next-line react/display-name
    tabBarIcon: ({ tintColor }) => (
      <Ionicons name="md-calendar" size={32} color={tintColor} />
    ),
  };
}

export default AnnualBudgetNavigator;
