import React, { PureComponent } from "react";
import { View, StyleSheet } from "react-native";
import { colors } from "@shared/theme";

class ListBackgroundFill extends PureComponent {
  render() {
    return <View style={styles.fill} />;
  }
}

const styles = StyleSheet.create({
  fill: {
    ...StyleSheet.absoluteFillObject,
    top: 300,
    backgroundColor: colors.backgroundColor,
  },
});

export default ListBackgroundFill;
