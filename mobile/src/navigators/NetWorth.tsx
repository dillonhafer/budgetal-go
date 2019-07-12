import { HeaderText } from "@src/components/Text";
import NetWorthScreen from "@src/screens/NetWorth";
import EditAssetLiabilityScreen from "@src/screens/NetWorth/EditAssetLiability";
import EditMonthItemScreen from "@src/screens/NetWorth/EditMonthItem";
import MonthListScreen from "@src/screens/NetWorth/MonthList";
import NewAssetLiabilityScreen from "@src/screens/NetWorth/NewAssetLiability";
import NewMonthItemScreen from "@src/screens/NetWorth/NewMonthItem";
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
    navigationOptions: ({ navigation }: NavigationScreenConfigProps) => ({
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
    navigationOptions: ({ navigation }: NavigationScreenConfigProps) => ({
      headerTitle: (
        <HeaderText>
          EDIT {navigation.getParam("item").name.toUpperCase()}
        </HeaderText>
      ),
    }),
  },
  NewMonthItemScreen: {
    screen: NewMonthItemScreen,
    navigationOptions: ({ navigation }: NavigationScreenConfigProps) => ({
      headerTitle: (
        <HeaderText>
          NEW {navigation.getParam("title").toUpperCase()}
        </HeaderText>
      ),
    }),
  },
  NewAssetLiabilityScreen: {
    screen: NewAssetLiabilityScreen,
    navigationOptions: ({ navigation }: NavigationScreenConfigProps) => ({
      headerTitle: <HeaderText>NEW {navigation.getParam("title")}</HeaderText>,
    }),
  },
  EditAssetLiabilityScreen: {
    screen: EditAssetLiabilityScreen,
    navigationOptions: ({ navigation }: NavigationScreenConfigProps) => ({
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
