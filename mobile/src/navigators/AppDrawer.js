import { createDrawerNavigator } from "react-navigation";
import { StatusBar } from "react-native";

// Navigators
import DrawerContent from "./DrawerContent";
import AccountNavigator from "@src/navigators/Account";
import BudgetNavigator from "@src/navigators/Budget";
import AnnualBudgetNavigator from "@src/navigators/AnnualBudget";
import StatisticsNavigator from "@src/navigators/Statistics";
import NetWorthNavigator from "@src/navigators/NetWorth";

import { colors } from "@shared/theme";

const AppDrawerNavigator = createDrawerNavigator(
  {
    Budgets: {
      screen: BudgetNavigator,
      navigationOptions: {
        drawer: {
          label: "Mom",
        },
      },
    },
    AnnualBudgets: {
      screen: AnnualBudgetNavigator,
    },
    Statistics: {
      screen: StatisticsNavigator,
    },
    NetWorth: {
      screen: NetWorthNavigator,
    },
    Account: {
      screen: AccountNavigator,
    },
  },
  {
    drawerBackgroundColor: colors.primary,
    contentComponent: DrawerContent,
    contentOptions: {
      activeBackgroundColor: "#2eb1fc",
      activeTintColor: "#fff",
      inactiveTintColor: "#fff",
    },
  }
);

const defaultGetStateForAction = AppDrawerNavigator.router.getStateForAction;
AppDrawerNavigator.router.getStateForAction = (action, state) => {
  if (
    state &&
    action.type === "Navigation/NAVIGATE" &&
    action.routeName === "DrawerClose"
  ) {
    StatusBar.setBarStyle("default", true);
  }

  return defaultGetStateForAction(action, state);
};

export default AppDrawerNavigator;
