import { headerBackTitleStyle, HeaderText } from "@src/components/Text";
import BudgetCategoryScreen from "@src/screens/budgets/BudgetCategory";
import BudgetItemScreen from "@src/screens/budgets/BudgetItem";
import BudgetsScreen from "@src/screens/budgets";
import EditBudgetItemScreen from "@src/screens/budgets/EditBudgetItem";
import EditBudgetItemExpenseScreen from "@src/screens/budgets/EditBudgetItemExpense";
import EditIncomeModal from "@src/screens/budgets/EditIncomeModal";
import ImportExpensesScreen from "@src/screens/budgets/ImportExpenses";
import NewBudgetItemScreen from "@src/screens/budgets/NewBudgetItem";
import NewBudgetItemExpenseScreen from "@src/screens/budgets/NewBudgetItemExpense";
import {
  BlurViewNavigationOptions,
  BurgerNavigationOptions,
  NavigationHeight,
} from "@src/utils/navigation-helpers";
import moment from "moment";
import React from "react";
import {
  createStackNavigator,
  NavigationScreenConfigProps,
} from "react-navigation";

const headerStyle = {
  height: NavigationHeight,
};

const BudgetNavigatorStack = createStackNavigator(
  {
    Budget: {
      screen: BudgetsScreen,
      navigationOptions: ({ navigation }: NavigationScreenConfigProps) => {
        const today = new Date();

        const year = navigation.getParam("year", today.getFullYear());
        const month = navigation.getParam("month", today.getMonth() + 1);
        const budgetDate = moment(`${year}-${month}-01`, "YYYY-MM-DD");

        const headerBackTitle = budgetDate.format("MMM").toUpperCase();
        return {
          headerRight: <EditIncomeModal />,
          headerTitle: <HeaderText>BUDGETS</HeaderText>,
          headerBackTitle,
          headerBackTitleStyle,
          ...BurgerNavigationOptions,
        };
      },
    },
    BudgetCategory: {
      screen: BudgetCategoryScreen,
      navigationOptions: () => ({
        headerTitle: <HeaderText>BUDGET ITEMS</HeaderText>,
      }),
    },
    BudgetItem: {
      screen: BudgetItemScreen,
      navigationOptions: () => ({
        headerTitle: <HeaderText>EXPENSES</HeaderText>,
      }),
    },
    NewBudgetItem: {
      screen: NewBudgetItemScreen,
      navigationOptions: () => ({
        headerTitle: <HeaderText>NEW ITEM</HeaderText>,
      }),
    },
    EditBudgetItem: {
      screen: EditBudgetItemScreen,
      navigationOptions: ({ navigation }: NavigationScreenConfigProps) => ({
        headerTitle: (
          <HeaderText>
            EDIT {navigation.getParam("budgetItem").name.toUpperCase()}
          </HeaderText>
        ),
      }),
    },
    NewBudgetItemExpense: {
      screen: NewBudgetItemExpenseScreen,
      navigationOptions: () => ({
        headerTitle: <HeaderText>NEW EXPENSE</HeaderText>,
      }),
    },
    EditBudgetItemExpense: {
      screen: EditBudgetItemExpenseScreen,
      navigationOptions: ({ navigation }: NavigationScreenConfigProps) => ({
        headerTitle: (
          <HeaderText>
            EDIT {navigation.getParam("budgetItemExpense").name.toUpperCase()}
          </HeaderText>
        ),
      }),
    },
    ImportExpenses: {
      screen: ImportExpensesScreen,
      navigationOptions: () => ({
        headerTitle: <HeaderText>IMPORT EXPENSES</HeaderText>,
      }),
    },
  },
  {
    cardStyle: {
      backgroundColor: "#ececec",
      shadowOpacity: 0,
    },
    defaultNavigationOptions: { ...BlurViewNavigationOptions, headerStyle },
  }
);

export default BudgetNavigatorStack;
