import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';

// Screens
import BudgetsScreen from 'screens/Budgets';
import BudgetCategoryScreen from 'screens/BudgetCategory';
import BudgetItemScreen from 'screens/BudgetItem';

import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';

const BudgetNavigatorStack = StackNavigator(
  {
    Budget: {
      screen: BudgetsScreen,
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
        const headerBackTitle = budgetDate.format('MMM');
        return {
          title,
          headerBackTitle,
        };
      },
    },
    BudgetCategory: {
      screen: BudgetCategoryScreen,
      path: 'budgetCategories/:budgetCategory',
      navigationOptions: ({ navigation }) => ({
        title: navigation.state.params.budgetCategory.name,
      }),
    },
    BudgetItem: {
      screen: BudgetItemScreen,
      path: 'budgetItems/:budgetItem',
      navigationOptions: ({ navigation }) => ({
        title: navigation.state.params.budgetItem.name,
      }),
    },
  },
  {
    cardStyle: {
      backgroundColor: '#ececec',
    },
  },
);

class BudgetNavigator extends Component {
  static navigationOptions = {
    header: null,
    tabBarLabel: 'Budgets',
    tabBarIcon: ({ tintColor }) => (
      <Ionicons name="md-calculator" size={32} color={tintColor} />
    ),
  };

  render() {
    return (
      <BudgetNavigatorStack
        screenProps={{ parentNavigation: this.props.navigation }}
      />
    );
  }
}

export default BudgetNavigator;
