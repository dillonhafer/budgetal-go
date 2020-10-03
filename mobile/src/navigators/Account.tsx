import { HeaderText } from "@src/components/Text";
import AccountScreen from "@src/screens/account/Account";
import AccountEditScreen from "@src/screens/account/AccountEdit";
import ChangePasswordScreen from "@src/screens/account/ChangePassword";
import SessionsScreen from "@src/screens/account/Sessions";
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

const AccountNavigatorStack = createStackNavigator(
	{
		AccountScreen: {
			screen: AccountScreen,
			navigationOptions: {
				headerTitle: <HeaderText>ACCOUNT SETTINGS</HeaderText>,
				headerBackTitle: "",
				...BurgerNavigationOptions,
			},
		},
		AccountEdit: {
			screen: AccountEditScreen,
			navigationOptions: {
				headerTitle: <HeaderText>ACCOUNT EDIT</HeaderText>,
			},
		},
		ChangePassword: {
			screen: ChangePasswordScreen,
			navigationOptions: {
				headerTitle: <HeaderText>CHANGE PASSWORD</HeaderText>,
			},
		},
		Sessions: {
			screen: SessionsScreen,
			navigationOptions: {
				headerTitle: <HeaderText>SESSIONS</HeaderText>,
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
			headerStyle,
		},
	}
);

export default AccountNavigatorStack;
