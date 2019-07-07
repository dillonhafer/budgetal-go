import {
  Feather,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import * as Font from "expo-font";
import { Image } from "react-native";
import { Asset } from "expo-asset";

// Cache functions
const cacheImages = (images: number[]) =>
  images.map(image => Asset.fromModule(image).downloadAsync());

const cacheFonts = (fonts: any[]) => fonts.map(font => Font.loadAsync(font));

export function preloadAssetsAsync() {
  let imageAssets: Promise<void>[] = [];

  if (__DEV__) {
    imageAssets = cacheImages([
      require("@src/assets/images/app_logo.png"),
      require("@src/assets/images/csv.png"),
      require("@src/assets/images/Charity.png"),
      require("@src/assets/images/Saving.png"),
      require("@src/assets/images/Housing.png"),
      require("@src/assets/images/Utilities.png"),
      require("@src/assets/images/Food.png"),
      require("@src/assets/images/Clothing.png"),
      require("@src/assets/images/Transportation.png"),
      require("@src/assets/images/Health.png"),
      require("@src/assets/images/Insurance.png"),
      require("@src/assets/images/Personal.png"),
      require("@src/assets/images/Recreation.png"),
      require("@src/assets/images/Debts.png"),
      require("@src/assets/images/onepassword.png"),
    ]);
  }

  const fontAssets = cacheFonts([
    FontAwesome.font,
    Ionicons.font,
    MaterialCommunityIcons.font,
    Feather.font,
    { "Lato-Light": require("@src/assets/fonts/Lato-Light.ttf") },
    { "Lato-Medium": require("@src/assets/fonts/Lato-Medium.ttf") },
  ]);

  return Promise.all([...imageAssets, ...fontAssets]);
}
