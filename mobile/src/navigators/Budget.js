import React, { PureComponent } from 'react';
import { View, Image, Text } from 'react-native';
import { StackNavigator } from 'react-navigation';

// Screens
import BudgetsScreen from 'screens/budgets/Budgets';
import BudgetCategoryScreen from 'screens/budgets/BudgetCategory';

// Items
import BudgetItemScreen from 'screens/budgets/BudgetItem';
import NewBudgetItemScreen from 'screens/budgets/NewBudgetItem';
import EditBudgetItemScreen from 'screens/budgets/EditBudgetItem';

// Expenses
import NewBudgetItemExpenseScreen from 'screens/budgets/NewBudgetItemExpense';
import EditBudgetItemExpenseScreen from 'screens/budgets/EditBudgetItemExpense';

import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import { categoryImage, currencyf } from 'utils/helpers';

const headerStyle = {
  height: 44,
};

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

        const headerBackTitle = budgetDate.format('MMM');
        return {
          headerLeft: null,
          gesturesEnabled: false,
          title: 'Budgets',
          headerBackTitle,
          headerStyle,
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
        headerStyle,
      }),
    },
    BudgetItem: {
      screen: BudgetItemScreen,
      path: 'budgetItems/:budgetItem',
      navigationOptions: ({ navigation }) => ({
        title: navigation.state.params.budgetItem.name,
        headerStyle,
      }),
    },
    NewBudgetItem: {
      screen: NewBudgetItemScreen,
      path: 'newBudgetItem',
      navigationOptions: ({ navigation }) => ({
        title: 'New Budget Item',
        headerStyle,
      }),
    },
    EditBudgetItem: {
      screen: EditBudgetItemScreen,
      path: 'editBudgetItem',
      navigationOptions: ({ navigation }) => ({
        title: `Edit ${navigation.state.params.budgetItem.name}`,
        headerStyle,
      }),
    },
    NewBudgetItemExpense: {
      screen: NewBudgetItemExpenseScreen,
      path: 'newBudgetItemExpense',
      navigationOptions: ({ navigation }) => ({
        title: 'New Expense',
        headerStyle,
      }),
    },
    EditBudgetItemExpense: {
      screen: EditBudgetItemExpenseScreen,
      path: 'editBudgetItemExpense',
      navigationOptions: ({ navigation }) => ({
        title: `Edit ${navigation.state.params.budgetItemExpense.name}`,
        headerStyle,
      }),
    },
  },
  {
    cardStyle: {
      backgroundColor: '#ececec',
    },
  },
);

class BudgetNavigator extends PureComponent {
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
