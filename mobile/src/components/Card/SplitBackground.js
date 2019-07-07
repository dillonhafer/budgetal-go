import React, { PureComponent } from "react";
import { View, StyleSheet, Platform } from "react-native";
import { colors } from "@shared/theme";

class SplitBackground extends PureComponent {
  render() {
    const { top, bottom } = this.props;
    const topColor = top ? { backgroundColor: top } : {};
    const bottomColor = bottom ? { backgroundColor: bottom } : {};
    return (
      <View>
        <View style={[styles.white, topColor]} />
        <View style={[styles.gray, bottomColor]}>
          <View style={styles.negativeMargin}>{this.props.children}</View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  white: {
    height: 100,
    backgroundColor: "#ffffff",
    zIndex: 0,
  },
  gray: {
    zIndex: 1,
    backgroundColor: colors.backgroundColor,
    ...Platform.select({
      android: {
        marginTop: -90,
        paddingTop: 90,
      },
    }),
  },
  negativeMargin: {
    ...Platform.select({
      ios: {
        marginTop: -90,
      },
      android: {
        marginTop: -90,
      },
    }),
  },
});

export default SplitBackground;
