import React from 'react';
import { View, Image, Text } from 'react-native';
import { StackNavigator } from 'react-navigation';

import TabletNavigator from 'navigators/TabletNavigator';

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
import ImportExpensesScreen from 'screens/budgets/ImportExpenses';

import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import { categoryImage } from 'utils/helpers';
import {
  NavigationHeight,
  BlurViewNavigationOptions,
  BurgerNavigationOptions,
  drawerIcon,
} from 'utils/navigation-helpers';
import EditIncomeModal from 'screens/budgets/EditIncomeModal';

const headerStyle = {
  height: NavigationHeight,
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
          headerRight: <EditIncomeModal />,
          gesturesEnabled: false,
          title: 'Budgets',
          headerBackTitle,
          headerStyle,
          ...BurgerNavigationOptions,
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
        title: 'Expenses',
        headerStyle,
      }),
    },
    NewBudgetItem: {
      screen: NewBudgetItemScreen,
      path: 'newBudgetItem',
      navigationOptions: () => ({
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
      navigationOptions: () => ({
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
    ImportExpenses: {
      screen: ImportExpensesScreen,
      navigationOptions: () => ({
        title: `Import Expenses`,
        headerStyle,
      }),
    },
  },
  {
    cardStyle: {
      backgroundColor: '#ececec',
      shadowOpacity: 0,
    },
    navigationOptions: { ...BlurViewNavigationOptions },
  },
);

const BudgetSidebarNavigatorStack = StackNavigator(
  {
    Main: {
      screen: View,
      navigationOptions: { header: null },
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
      navigationOptions: () => ({
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
      navigationOptions: () => ({
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
    ImportExpenses: {
      screen: ImportExpensesScreen,
      path: 'importExpenses',
      navigationOptions: () => ({
        headerStyle,
        title: 'Import Expenses',
      }),
    },
  },
  {
    cardStyle: {
      shadowOpacity: 0,
    },
    navigationOptions: BlurViewNavigationOptions,
  },
);

class BudgetNavigator extends TabletNavigator {
  MainNavigator = BudgetNavigatorStack;
  SideNavigator = BudgetSidebarNavigatorStack;

  static navigationOptions = {
    // eslint-disable-next-line react/display-name
    drawerLabel: ({ tintColor }) => (
      <Text style={{ color: tintColor, fontWeight: 'bold' }}>BUDGETS</Text>
    ),
    // Width 32 Fix for react-navigation bugs
    // eslint-disable-next-line react/display-name
    drawerIcon: drawerIcon('md-calculator'),
  };
}

export default BudgetNavigator;
