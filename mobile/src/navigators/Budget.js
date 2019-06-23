import React from "react";
import { View, Image } from "react-native";
import { createStackNavigator } from "react-navigation";

import TabletNavigator from "@src/navigators/TabletNavigator";

// Screens
import BudgetsScreen from "@src/screens/budgets/Budgets";
import BudgetCategoryScreen from "@src/screens/budgets/BudgetCategory";

// Items
import BudgetItemScreen from "@src/screens/budgets/BudgetItem";
import NewBudgetItemScreen from "@src/screens/budgets/NewBudgetItem";
import EditBudgetItemScreen from "@src/screens/budgets/EditBudgetItem";

// Expenses
import NewBudgetItemExpenseScreen from "@src/screens/budgets/NewBudgetItemExpense";
import EditBudgetItemExpenseScreen from "@src/screens/budgets/EditBudgetItemExpense";
import ImportExpensesScreen from "@src/screens/budgets/ImportExpenses";

import moment from "moment";
import { categoryImage } from "@src/assets/images";
import {
  NavigationHeight,
  BlurViewNavigationOptions,
  BurgerNavigationOptions,
  drawerIcon,
} from "@src/utils/navigation-helpers";
import EditIncomeModal from "@src/screens/budgets/EditIncomeModal";
import {
  BudgetalText,
  HeaderText,
  headerBackTitleStyle,
} from "@src/components/Text";

const headerStyle = {
  height: NavigationHeight,
};

const CategoryTitle = ({ name }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image style={{ width: 20, height: 20 }} source={categoryImage(name)} />
      <HeaderText style={{ marginLeft: 5 }}>{name}</HeaderText>
    </View>
  );
};

const BudgetNavigatorStack = createStackNavigator(
  {
    Budget: {
      screen: BudgetsScreen,
      path: "budgets/:year/:month",
      navigationOptions: ({ navigation }) => {
        const today = new Date();

        const year = navigation.getParam("year", today.getFullYear());
        const month = navigation.getParam("month", today.getMonth() + 1);
        const budgetDate = moment(`${year}-${month}-01`, "YYYY-MM-DD");

        const headerBackTitle = budgetDate.format("MMM").toUpperCase();
        return {
          headerRight: <EditIncomeModal />,
          gesturesEnabled: false,
          headerTitle: <HeaderText>BUDGETS</HeaderText>,
          headerBackTitle,
          headerBackTitleStyle,
          headerStyle,
          ...BurgerNavigationOptions,
        };
      },
    },
    BudgetCategory: {
      screen: BudgetCategoryScreen,
      path: "budgetCategories/:budgetCategory",
      navigationOptions: () => ({
        headerTitle: <HeaderText>BUDGET ITEMS</HeaderText>,
        headerStyle,
      }),
    },
    BudgetItem: {
      screen: BudgetItemScreen,
      path: "budgetItems/:budgetItem",
      navigationOptions: () => ({
        headerTitle: <HeaderText>EXPENSES</HeaderText>,
        headerStyle,
      }),
    },
    NewBudgetItem: {
      screen: NewBudgetItemScreen,
      path: "newBudgetItem",
      navigationOptions: () => ({
        headerTitle: <HeaderText>NEW ITEM</HeaderText>,
        headerStyle,
      }),
    },
    EditBudgetItem: {
      screen: EditBudgetItemScreen,
      path: "editBudgetItem",
      navigationOptions: ({ navigation }) => ({
        headerTitle: (
          <HeaderText>
            EDIT {navigation.getParam("budgetItem").name.toUpperCase()}
          </HeaderText>
        ),
        headerStyle,
      }),
    },
    NewBudgetItemExpense: {
      screen: NewBudgetItemExpenseScreen,
      path: "newBudgetItemExpense",
      navigationOptions: () => ({
        headerTitle: <HeaderText>NEW EXPENSE</HeaderText>,
        headerStyle,
      }),
    },
    EditBudgetItemExpense: {
      screen: EditBudgetItemExpenseScreen,
      path: "editBudgetItemExpense",
      navigationOptions: ({ navigation }) => ({
        headerTitle: (
          <HeaderText>
            EDIT {navigation.getParam("budgetItemExpense").name.toUpperCase()}
          </HeaderText>
        ),
        headerStyle,
      }),
    },
    ImportExpenses: {
      screen: ImportExpensesScreen,
      navigationOptions: () => ({
        headerTitle: <HeaderText>IMPORT EXPENSES</HeaderText>,
        headerStyle,
      }),
    },
  },
  {
    cardStyle: {
      backgroundColor: "#ececec",
      shadowOpacity: 0,
    },
    navigationOptions: { ...BlurViewNavigationOptions },
  }
);

const BudgetSidebarNavigatorStack = createStackNavigator(
  {
    Main: {
      screen: View,
      navigationOptions: { header: null },
    },
    BudgetCategory: {
      screen: BudgetCategoryScreen,
      path: "budgetCategories/:budgetCategory",
      navigationOptions: ({ navigation }) => ({
        title: navigation.getParam("budgetCategory").name,
        headerTitle: (
          <CategoryTitle
            name={navigation.getParam("budgetCategory").name.toUpperCase()}
          />
        ),
        headerStyle,
      }),
    },
    BudgetItem: {
      screen: BudgetItemScreen,
      path: "budgetItems/:budgetItem",
      navigationOptions: ({ navigation }) => ({
        headerTitle: (
          <HeaderText>
            {navigation
              .getParam("budgetItem", { name: "ITEM" })
              .name.toUpperCase()}
          </HeaderText>
        ),
        headerStyle,
      }),
    },
    NewBudgetItem: {
      screen: NewBudgetItemScreen,
      path: "newBudgetItem",
      navigationOptions: () => ({
        headerTitle: <HeaderText>NEW BUDGET ITEM</HeaderText>,
        headerStyle,
      }),
    },
    EditBudgetItem: {
      screen: EditBudgetItemScreen,
      path: "editBudgetItem",
      navigationOptions: ({ navigation }) => ({
        headerTitle: (
          <HeaderText>
            EDIT{" "}
            {navigation
              .getParam("budgetItem", { name: "ITEM" })
              .name.toUpperCase()}
          </HeaderText>
        ),
        headerStyle,
      }),
    },
    NewBudgetItemExpense: {
      screen: NewBudgetItemExpenseScreen,
      path: "newBudgetItemExpense",
      navigationOptions: () => ({
        headerTitle: <HeaderText>NEW EXPENSE</HeaderText>,
        headerStyle,
      }),
    },
    EditBudgetItemExpense: {
      screen: EditBudgetItemExpenseScreen,
      path: "editBudgetItemExpense",
      navigationOptions: ({ navigation }) => ({
        headerTitle: (
          <HeaderText>
            EDIT{" "}
            {navigation
              .getParam("budgetItemExpense", { name: "EXPENSE" })
              .name.toUpperCase()}
          </HeaderText>
        ),
        headerStyle,
      }),
    },
    ImportExpenses: {
      screen: ImportExpensesScreen,
      path: "importExpenses",
      navigationOptions: () => ({
        headerStyle,
        headerTitle: <HeaderText>IMPORT EXPENSES</HeaderText>,
      }),
    },
  },
  {
    cardStyle: {
      shadowOpacity: 0,
    },
    navigationOptions: BlurViewNavigationOptions,
  }
);

class BudgetNavigator extends TabletNavigator {
  MainNavigator = BudgetNavigatorStack;
  SideNavigator = BudgetSidebarNavigatorStack;
  static router = BudgetNavigatorStack.router;

  static navigationOptions = {
    // eslint-disable-next-line react/display-name
    drawerLabel: ({ tintColor }) => (
      <BudgetalText style={{ color: tintColor }}>BUDGETS</BudgetalText>
    ),
    // Width 32 Fix for react-navigation bugs
    // eslint-disable-next-line react/display-name
    drawerIcon: drawerIcon("md-calculator"),
  };
}

export default BudgetNavigator;
