import { headerBackTitleStyle, HeaderText } from "@src/components/Text";
import AnnualBudgetsScreen from "@src/screens/AnnualBudgets/AnnualBudgets";
import EditAnnualBudgetItemScreen from "@src/screens/AnnualBudgets/EditAnnualBudgetItem";
import NewAnnualBudgetItemScreen from "@src/screens/AnnualBudgets/NewAnnualBudgetItem";
import ProgressScreen from "@src/screens/AnnualBudgets/Progress";
import {
  BlurViewNavigationOptions,
  BurgerNavigationOptions,
  NavigationHeight,
} from "@src/utils/navigation-helpers";
import React from "react";
import {
  createStackNavigator,
  NavigationScreenConfigProps,
} from "react-navigation";

const headerStyle = {
  height: NavigationHeight,
};

const AnnualBudgetNavigatorStack = createStackNavigator(
  {
    AnnualBudget: {
      screen: AnnualBudgetsScreen,
      path: "annual-budgets/:year",
      navigationOptions: ({ navigation }: NavigationScreenConfigProps) => {
        const year = navigation.getParam("year", new Date().getFullYear());

        return {
          headerTitle: <HeaderText>ANNUAL BUDGETS</HeaderText>,
          headerBackTitle: `${year}`,
          headerBackTitleStyle,
          ...BurgerNavigationOptions,
        };
      },
    },
    AnnualBudgetProgress: {
      screen: ProgressScreen,
      path: "annual-budgets/:budgetItem",
      navigationOptions: () => ({
        headerTitle: <HeaderText>PROGRESS</HeaderText>,
      }),
    },
    NewAnnualBudgetItem: {
      screen: NewAnnualBudgetItemScreen,
      path: "newAnnualBudgetItem",
      navigationOptions: () => ({
        headerTitle: <HeaderText>NEW ANNUAL ITEM</HeaderText>,
      }),
    },
    EditAnnualBudgetItem: {
      screen: EditAnnualBudgetItemScreen,
      path: "editAnnualBudgetItem",
      navigationOptions: ({ navigation }: NavigationScreenConfigProps) => ({
        headerTitle: (
          <HeaderText>
            EDIT{" "}
            {navigation
              .getParam("annualBudgetItem", { name: "" })
              .name.toUpperCase()}
          </HeaderText>
        ),
      }),
    },
  },
  {
    cardStyle: {
      backgroundColor: "#ececec",
      shadowOpacity: 0,
    },
    defaultNavigationOptions: {
      ...BlurViewNavigationOptions,
      headerStyle,
    },
  }
);

export default AnnualBudgetNavigatorStack;
