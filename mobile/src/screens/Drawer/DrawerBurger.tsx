import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { NavigationScreenConfigProps } from "react-navigation";

const DrawerBurger = ({ navigation }: NavigationScreenConfigProps) => {
  return (
    <View>
      <TouchableOpacity onPress={navigation.openDrawer}>
        <Ionicons
          name="ios-menu"
          size={30}
          color={"#037aff"}
          style={{
            paddingHorizontal: 15,
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default React.memo(DrawerBurger);
