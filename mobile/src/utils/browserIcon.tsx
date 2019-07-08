import React from "react";
import { humanUA } from "@shared/helpers";
import { colors } from "@shared/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export const browser = (ua: string) => {
  const hua = humanUA(ua);
  let icon = "earth";
  let color = colors.primary;

  if (/chrome/i.test(hua)) {
    icon = "google-chrome";
    color = "#f4c20f";
  }

  if (/explorer/i.test(hua)) {
    icon = "internet-explorer";
  }

  if (/ie/i.test(hua)) {
    icon = "internet-explorer";
  }

  if (/edge/i.test(hua)) {
    icon = "edge";
  }

  if (/safari/i.test(hua)) {
    icon = "apple-safari";
  }

  if (/firefox/i.test(hua)) {
    icon = "firefox";
    color = "#E55B0A";
  }

  if (/on iOS/i.test(hua)) {
    icon = "apple";
    color = "#333";
  }

  if (/on Android/i.test(hua)) {
    icon = "android";
    color = "#76c258";
  }

  if (/opera/i.test(hua)) {
    icon = "opera";
    color = "#ff1b2e";
  }

  return <MaterialCommunityIcons name={icon} size={28} color={color} />;
};
