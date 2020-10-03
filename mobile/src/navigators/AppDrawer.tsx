import { colors } from "@shared/theme";
import AccountNavigator from "@src/navigators/Account";
import AnnualBudgetNavigator from "@src/navigators/AnnualBudget";
import BudgetNavigator from "@src/navigators/Budget";
import NetWorthNavigator from "@src/navigators/NetWorth";
import StatisticsNavigator from "@src/navigators/Statistics";
import { DrawerContent, toggleStatusBarStyle } from "@src/screens/Drawer";
import { createDrawerNavigator } from "react-navigation";

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
toggleStatusBarStyle(AppDrawerNavigator);

export default AppDrawerNavigator;
