import React from "react";
import { StyleSheet, Platform, View } from "react-native";
import { BlurView } from "expo-blur";

import { Ionicons } from "@expo/vector-icons";
import { withNavigation } from "react-navigation";
import { DrawerBurger } from "@src/screens/Drawer";
import { colors } from "@shared/theme";

export const NavigationHeight = 44;
export const SidebarNavigationHeight = 43.5;

export const BlurViewInsetProps = {
  contentInset: { top: NavigationHeight, bottom: 0, left: 0, right: 0 },
  contentOffset: { y: -NavigationHeight, x: 0 },
  contentInsetAdjustmentBehavior: "automatic",
  automaticallyAdjustContentInsets: true,
  contentContainerStyle: {
    backgroundColor: colors.backgroundColor,
    minHeight: "80%",
  },
};

export const BlurViewNavigationOptions = {
  headerTransparent: true,
  headerBackground: Platform.select({
    ios: (
      <View
        style={{
          flex: 1,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: "#d6d7da",
        }}
      >
        <BlurView
          style={{
            flex: 1,
          }}
          intensity={100}
          tint="light"
        />
      </View>
    ),
    android: (
      <View style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.9)" }} />
    ),
  }),
};

export const drawerIcon = name => ({ tintColor }) => (
  <Ionicons
    name={name}
    style={{
      width: 22,
      textAlign: "center",
      margin: 10,
      marginLeft: 20,
    }}
    size={22}
    color={tintColor}
  />
);

const NavDrawerBurger = withNavigation(DrawerBurger);
export const BurgerNavigationOptions = {
  drawerIcon,
  headerLeft: <NavDrawerBurger />,
};
