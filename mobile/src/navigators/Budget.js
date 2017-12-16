import React, { Component } from 'react';
import { View, Image, Text } from 'react-native';
import { StackNavigator } from 'react-navigation';

// Screens
import BudgetsScreen from 'screens/budgets/Budgets';
import BudgetCategoryScreen from 'screens/budgets/BudgetCategory';
import BudgetItemScreen from 'screens/budgets/BudgetItem';
import NewBudgetItemExpenseScreen from 'screens/budgets/NewBudgetItemExpense';

import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import { categoryImage, currencyf } from 'utils/helpers';

const CategoryTitle = ({ name }) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Image style={{ width: 20, height: 20 }} source={categoryImage(name)} />
      <Text style={{ marginLeft: 5, fontSize: 17, fontWeight: '600' }}>
        {name}
      </Text>
    </View>
  );
};

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
        const income =
          (navigation.state.params && navigation.state.params.income) || 0;
        const headerTitle = (
          <View>
            <Text
              style={{ fontWeight: '800', fontSize: 16, textAlign: 'center' }}
            >
              Budgets
            </Text>
            <Text style={{ textAlign: 'center' }}>{currencyf(income)}</Text>
          </View>
        );
        const headerBackTitle = budgetDate.format('MMM');
        return {
          headerTitle,
          headerBackTitle,
        };
      },
    },
    BudgetCategory: {
      screen: BudgetCategoryScreen,
      path: 'budgetCategories/:budgetCategory',
      navigationOptions: ({ navigation }) => ({
        title: navigation.state.params.budgetCategory.name,
        headerTitle: (
          <CategoryTitle name={navigation.state.params.budgetCategory.name} />
        ),
      }),
    },
    BudgetItem: {
      screen: BudgetItemScreen,
      path: 'budgetItems/:budgetItem',
      navigationOptions: ({ navigation }) => ({
        title: navigation.state.params.budgetItem.name,
      }),
    },
    NewBudgetItemExpense: {
      screen: NewBudgetItemExpenseScreen,
      path: 'newBudgetItemExpense',
      navigationOptions: ({ navigation }) => ({
        title: 'New Expense',
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
