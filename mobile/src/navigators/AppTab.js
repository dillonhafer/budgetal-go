import { Platform } from "react-native";
import { createBottomTabNavigator } from "react-navigation";

// Navigators
import AccountNavigator from "@src/navigators/Account";
import BudgetNavigator from "@src/navigators/Budget";
import AnnualBudgetNavigator from "@src/navigators/AnnualBudget";
import StatisticsNavigator from "@src/navigators/Statistics";

import { colors } from "@shared/theme";
import Device from "@src/utils/Device";

const AppTabNavigator = createBottomTabNavigator(
  {
    Budgets: {
      screen: BudgetNavigator,
    },
    AnnualBudgets: {
      screen: AnnualBudgetNavigator,
    },
    Statistics: {
      screen: StatisticsNavigator,
    },
    Account: {
      screen: AccountNavigator,
    },
  },
  {
    tabBarPosition: "bottom",
    animationEnabled: false,
    swipeEnabled: false,
    tabBarOptions: {
      showIcon: true,
      activeTintColor: colors.primary,
      inactiveTintColor: "rgba(146, 146, 146, 1)",
      inactiveBackgroundColor: "#f7f7f7",
      labelStyle: {
        fontSize: Device.isTablet() ? 14 : 10,
      },
      style: {
        ...(Platform.OS === "ios" ? { height: 49 } : { height: 58 }),
        ...(Device.isTablet() ? { height: 54 } : {}),
        backgroundColor: "#f7f7f7",
      },
      indicatorStyle: {
        backgroundColor: colors.primary,
      },
    },
  }
);
export default AppTabNavigator;
