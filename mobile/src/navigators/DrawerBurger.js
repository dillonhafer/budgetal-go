import React, { PureComponent } from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

class DrawerBurger extends PureComponent {
  openDrawer = () => {
    this.props.navigation.openDrawer();
  };

  render() {
    return (
      <View>
        <TouchableOpacity onPress={this.openDrawer}>
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
  }
}

export default DrawerBurger;
