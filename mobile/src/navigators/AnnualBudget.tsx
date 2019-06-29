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
        const year =
          (navigation.state.params && navigation.state.params.year) ||
          new Date().getFullYear();

        return {
          gesturesEnabled: false,
          headerTitle: <HeaderText>ANNUAL BUDGETS</HeaderText>,
          headerBackTitle: `${year}`,
          headerStyle,
          headerBackTitleStyle,
          ...BlurViewNavigationOptions,
          ...BurgerNavigationOptions,
        };
      },
    },
    AnnualBudgetProgress: {
      screen: ProgressScreen,
      path: "annual-budgets/:budgetItem",
      navigationOptions: () => ({
        ...BlurViewNavigationOptions,
        headerTitle: <HeaderText>PROGRESS</HeaderText>,
        headerStyle,
      }),
    },
    NewAnnualBudgetItem: {
      screen: NewAnnualBudgetItemScreen,
      path: "newAnnualBudgetItem",
      navigationOptions: () => ({
        ...BlurViewNavigationOptions,
        headerTitle: <HeaderText>NEW ANNUAL ITEM</HeaderText>,
        headerStyle,
      }),
    },
    EditAnnualBudgetItem: {
      screen: EditAnnualBudgetItemScreen,
      path: "editAnnualBudgetItem",
      navigationOptions: ({ navigation }: NavigationScreenConfigProps) => ({
        ...BlurViewNavigationOptions,
        headerTitle: (
          <HeaderText>
            EDIT{" "}
            {navigation
              .getParam("annualBudgetItem", { name: "" })
              .name.toUpperCase()}
          </HeaderText>
        ),
        headerStyle,
      }),
    },
  },
  {
    cardStyle: {
      backgroundColor: "#ececec",
      shadowOpacity: 0,
    },
    defaultNavigationOptions: BlurViewNavigationOptions,
  }
);

export default AnnualBudgetNavigatorStack;
