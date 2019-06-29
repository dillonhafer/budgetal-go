import { HeaderText } from "@src/components/Text";
import StatisticsScreen from "@src/screens/Statistics/Statistics";
import {
  BlurViewNavigationOptions,
  BurgerNavigationOptions,
  NavigationHeight,
} from "@src/utils/navigation-helpers";
import React from "react";
import { createStackNavigator } from "react-navigation";

const headerStyle = {
  height: NavigationHeight,
};

const StatisticsNavigatorStack = createStackNavigator(
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
    defaultNavigationOptions: {
      ...BlurViewNavigationOptions,
      ...BurgerNavigationOptions,
    },
  }
);

export default StatisticsNavigatorStack;
