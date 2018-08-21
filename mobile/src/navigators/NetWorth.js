import React from 'react';
import { StackNavigator } from 'react-navigation';
import { BudgetalText } from 'components/Text';

import TabletNavigator from './TabletNavigator';

// Screens
import NetWorthScreen from 'screens/net-worth/NetWorth';
import MonthListScreen from 'screens/net-worth/MonthList';
import NewMonthItemScreen from 'screens/net-worth/NewMonthItem';
import EditMonthItemScreen from 'screens/net-worth/EditMonthItem';

import {
  NavigationHeight,
  SidebarNavigationHeight,
  drawerIcon,
  BurgerNavigationOptions,
  BlurViewNavigationOptions,
} from 'utils/navigation-helpers';
const sidebarHeaderStyle = {
  height: SidebarNavigationHeight,
  width: 300,
};
const headerStyle = {
  height: NavigationHeight,
};

const NetWorthNavigatorStack = StackNavigator(
  {
    NetWorthScreen: {
      screen: NetWorthScreen,
      navigationOptions: () => ({
        title: 'Net Worth',
        ...BurgerNavigationOptions,
      }),
    },
    MonthListScreen: {
      screen: MonthListScreen,
      navigationOptions: ({ navigation }) => ({
        title: `${navigation.state.params.month.label} ${
          navigation.state.params.year
        }`,
        headerStyle,
        ...BlurViewNavigationOptions,
      }),
    },
    EditMonthItemScreen: {
      screen: EditMonthItemScreen,
      navigationOptions: ({ navigation }) => ({
        title: `Edit ${navigation.state.params.item.name}`,
        headerStyle,
        ...BlurViewNavigationOptions,
      }),
    },
    NewMonthItemScreen: {
      screen: NewMonthItemScreen,
      navigationOptions: ({ navigation }) => ({
        title: `New ${navigation.state.params.title}`,
        headerStyle,
        ...BlurViewNavigationOptions,
      }),
    },
  },
  {
    cardStyle: {
      backgroundColor: '#ececec',
      shadowOpacity: 0,
    },
  },
);

const NetWorthSidebarNavigatorStack = StackNavigator(
  {
    MonthListScreen: {
      screen: MonthListScreen,
      navigationOptions: screenProps => ({
        headerStyle: sidebarHeaderStyle,
        title: `${screenProps.month.name} 2019`,
        ...BurgerNavigationOptions,
      }),
    },
  },
  {},
);

class NetWorthNavigator extends TabletNavigator {
  MainNavigator = NetWorthNavigatorStack;
  SideNavigator = NetWorthSidebarNavigatorStack;

  static navigationOptions = {
    // eslint-disable-next-line react/display-name
    drawerLabel: ({ tintColor }) => (
      <BudgetalText style={{ color: tintColor }}>NET WORTH</BudgetalText>
    ),
    drawerIcon: drawerIcon('md-trending-up'),
  };
}

export default NetWorthNavigator;
