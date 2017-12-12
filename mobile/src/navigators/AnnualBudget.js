import React, { Component } from 'react';
import { View, Image, Text } from 'react-native';
import { StackNavigator } from 'react-navigation';

// Screens
import AnnualBudgetsScreen from 'screens/AnnualBudgets';
import AnnualBudgetItemProgressScreen from 'screens/AnnualBudgetItemProgress';

import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';

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
          title: `Annual Budgets`,
          headerBackTitle: year,
        };
      },
    },
    AnnualBudgetProgress: {
      screen: AnnualBudgetItemProgressScreen,
      path: 'annual-budgets/:budgetItem',
      navigationOptions: ({ navigation }) => ({
        title: 'Progress',
      }),
    },
  },
  {
    cardStyle: {
      backgroundColor: '#ececec',
    },
  },
);

class AnnualBudgetNavigator extends Component {
  static navigationOptions = {
    header: null,
    tabBarLabel: 'Annual',
    tabBarIcon: ({ tintColor }) => (
      <Ionicons name="md-calendar" size={32} color={tintColor} />
    ),
  };

  render() {
    return (
      <AnnualBudgetNavigatorStack
        screenProps={{ parentNavigation: this.props.navigation }}
      />
    );
  }
}

export default AnnualBudgetNavigator;
