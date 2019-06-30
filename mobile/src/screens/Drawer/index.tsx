import { StatusBar } from "react-native";
import { NavigationContainer } from "react-navigation";
export { default as DrawerContent } from "./DrawerContent";
export { default as DrawerBurger } from "./DrawerBurger";

// Private react navigation API, may break in the future 🤷‍♂️
type Action = {
  willShow?: boolean;
};

export const toggleStatusBarStyle = (drawerNavigator: NavigationContainer) => {
  const defaultGetStateForAction = drawerNavigator.router.getStateForAction;
  drawerNavigator.router.getStateForAction = (action, state) => {
    const marked =
      action && ["Navigation/MARK_DRAWER_SETTLING"].includes(action.type);

    if (marked && !(action as Action).willShow) {
      StatusBar.setBarStyle("default", true);
    }

    if (marked && (action as Action).willShow) {
      StatusBar.setBarStyle("light-content", true);
    }

    return defaultGetStateForAction(action, state);
  };
};
