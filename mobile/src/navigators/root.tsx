import AppDrawerNavigator from "@src/navigators/AppDrawer";
import AuthLoadingScreen from "@src/screens/AuthLoading";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import AuthStack from "./AuthStack";

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      Auth: { screen: AuthStack, path: "" },
      App: {
        screen: AppDrawerNavigator,
        navigationOptions: {
          header: null,
        },
      },
    },
    {
      initialRouteName: "AuthLoading",
    }
  )
);
