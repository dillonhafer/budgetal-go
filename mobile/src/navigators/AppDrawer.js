import { colors } from "@shared/theme";
import AccountNavigator from "@src/navigators/Account";
import AnnualBudgetNavigator from "@src/navigators/AnnualBudget";
import BudgetNavigator from "@src/navigators/Budget";
import NetWorthNavigator from "@src/navigators/NetWorth";
import StatisticsNavigator from "@src/navigators/Statistics";
import { createDrawerNavigator } from "react-navigation";
import DrawerContent from "./DrawerContent";
import { StatusBar } from "react-native";

const AppDrawerNavigator = createDrawerNavigator(
  {
    Budgets: BudgetNavigator,
    AnnualBudgets: AnnualBudgetNavigator,
    Statistics: StatisticsNavigator,
    NetWorth: NetWorthNavigator,
    Account: AccountNavigator,
  },
  {
    drawerBackgroundColor: colors.primary,
    contentComponent: DrawerContent,
  }
);

const defaultGetStateForAction = AppDrawerNavigator.router.getStateForAction;
AppDrawerNavigator.router.getStateForAction = (action, state) => {
  const marked = action && action.type === "Navigation/MARK_DRAWER_SETTLING";
  if (marked && !action.willShow) {
    StatusBar.setBarStyle("default", true);
  }

  if (marked && action.willShow) {
    StatusBar.setBarStyle("light-content", true);
  }

  return defaultGetStateForAction(action, state);
};

export default AppDrawerNavigator;
