import { HeaderText } from "@src/components/Text";
import NetWorthScreen from "@src/screens/net-worth";
import EditAssetLiabilityScreen from "@src/screens/net-worth/EditAssetLiability";
import EditMonthItemScreen from "@src/screens/net-worth/EditMonthItem";
import MonthListScreen from "@src/screens/net-worth/MonthList";
import NewAssetLiabilityScreen from "@src/screens/net-worth/NewAssetLiability";
import NewMonthItemScreen from "@src/screens/net-worth/NewMonthItem";
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

const screens = {
  NetWorthScreen: {
    screen: NetWorthScreen,
    navigationOptions: () => ({
      headerTitle: <HeaderText>NET WORTH</HeaderText>,
      ...BurgerNavigationOptions,
    }),
  },
  MonthListScreen: {
    screen: MonthListScreen,
    navigationOptions: ({ navigation }) => ({
      headerTitle: (
        <HeaderText>
          {navigation.getParam("month").label.toUpperCase()}{" "}
          {navigation.getParam("year")}
        </HeaderText>
      ),
    }),
  },
  EditMonthItemScreen: {
    screen: EditMonthItemScreen,
    navigationOptions: ({ navigation }) => ({
      headerTitle: (
        <HeaderText>
          EDIT {navigation.getParam("item").name.toUpperCase()}
        </HeaderText>
      ),
    }),
  },
  NewMonthItemScreen: {
    screen: NewMonthItemScreen,
    navigationOptions: ({ navigation }) => ({
      headerTitle: (
        <HeaderText>
          NEW {navigation.getParam("title").toUpperCase()}
        </HeaderText>
      ),
    }),
  },
  NewAssetLiabilityScreen: {
    screen: NewAssetLiabilityScreen,
    navigationOptions: ({ navigation }) => ({
      headerTitle: <HeaderText>NEW {navigation.getParam("title")}</HeaderText>,
    }),
  },
  EditAssetLiabilityScreen: {
    screen: EditAssetLiabilityScreen,
    navigationOptions: ({ navigation }) => ({
      headerTitle: (
        <HeaderText>
          EDIT {navigation.getParam("item").name.toUpperCase()}
        </HeaderText>
      ),
    }),
  },
};

const NetWorthNavigatorStack = createStackNavigator(
  { ...screens },
  {
    cardStyle: {
      backgroundColor: "#ececec",
      shadowOpacity: 0,
    },
    defaultNavigationOptions: {
      headerStyle,
      ...BlurViewNavigationOptions,
    },
  }
);

export default NetWorthNavigatorStack;
