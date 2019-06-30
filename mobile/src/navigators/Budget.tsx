import { headerBackTitleStyle, HeaderText } from "@src/components/Text";
import BudgetCategoryScreen from "@src/screens/BudgetStack/BudgetItems/BudgetItems";
import BudgetItemScreen from "@src/screens/BudgetStack/BudgetItemExpenses/BudgetItemExpenses";
import BudgetsScreen from "@src/screens/BudgetStack/Budgets";
import EditBudgetItemScreen from "@src/screens/BudgetStack/BudgetItems/Edit";
import EditBudgetItemExpenseScreen from "@src/screens/BudgetStack/BudgetItemExpenses/Edit";
import EditIncomeModal from "@src/screens/BudgetStack/EditIncomeModal";
import ImportExpensesScreen from "@src/screens/BudgetStack/ImportExpenses";
import NewBudgetItemScreen from "@src/screens/BudgetStack/BudgetItems/New";
import NewBudgetItemExpenseScreen from "@src/screens/BudgetStack/BudgetItemExpenses/New";
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
