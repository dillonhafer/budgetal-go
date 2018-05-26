import React from "react";
import { Platform, View } from "react-native";
import { BlurView } from "expo";

import { Ionicons } from "@expo/vector-icons";
import { withNavigation } from "react-navigation";
import DrawerBurger from "navigators/DrawerBurger";

export const NavigationHeight = 44;
export const SidebarNavigationHeight = 43.5;

export const BlurViewInsetProps = {
  contentInset: { top: NavigationHeight },
  contentOffset: { y: -NavigationHeight },
  contentInsetAdjustmentBehavior: "automatic"
};

export const BlurViewNavigationOptions = {
  headerTransparent: true,
  headerBackground: Platform.select({
    ios: <BlurView style={{ flex: 1 }} intensity={100} tint="light" />,
    android: (
      <View style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.7)" }} />
    )
  })
};

export const drawerIcon = name => ({ tintColor }) => (
  <Ionicons
    name={name}
    style={{
      width: 22,
      textAlign: "center",
      margin: 10,
      marginLeft: 20
    }}
    size={22}
    color={tintColor}
  />
);

const NavDrawerBurger = withNavigation(DrawerBurger);
export const BurgerNavigationOptions = {
  drawerIcon,
  headerLeft: <NavDrawerBurger />
};
