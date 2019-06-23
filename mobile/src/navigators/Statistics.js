import React from "react";
import { createStackNavigator } from "react-navigation";
import { BudgetalText, HeaderText } from "@src/components/Text";

import TabletNavigator from "./TabletNavigator";

// Screens
import StatisticsScreen from "@src/screens/statistics/Statistics";
import MonthlyChartScreen from "@src/screens/statistics/MonthlyChart";

import {
  NavigationHeight,
  SidebarNavigationHeight,
  BlurViewNavigationOptions,
  BurgerNavigationOptions,
  drawerIcon,
} from "@src/utils/navigation-helpers";
const headerStyle = {
  height: NavigationHeight,
};
const sidebarHeaderStyle = {
  height: SidebarNavigationHeight,
};

const AccountNavigatorStack = createStackNavigator(
  {
    Statistics: {
      screen: StatisticsScreen,
      navigationOptions: {
        headerStyle,
        headerTitle: <HeaderText>STATISTICS</HeaderText>,
      },
    },
  },
  {
    cardStyle: {
      backgroundColor: "#ececec",
      shadowOpacity: 0,
    },
    navigationOptions: {
      ...BlurViewNavigationOptions,
      ...BurgerNavigationOptions,
    },
  }
);

const StatisticsSidebarNavigatorStack = createStackNavigator(
  {
    MonthlyChart: {
      screen: MonthlyChartScreen,
      navigationOptions: () => {
        return {
          headerStyle: sidebarHeaderStyle,
          headerTitle: <HeaderText>CHART VIEW</HeaderText>,
        };
      },
    },
  },
  {}
);

class StatisticsNavigator extends TabletNavigator {
  MainNavigator = AccountNavigatorStack;
  SideNavigator = StatisticsSidebarNavigatorStack;

  static navigationOptions = {
    // eslint-disable-next-line react/display-name
    drawerLabel: ({ tintColor }) => (
      <BudgetalText style={{ color: tintColor }}>STATISTICS</BudgetalText>
    ),
    drawerIcon: drawerIcon("md-stats"),
  };
}

export default StatisticsNavigator;
