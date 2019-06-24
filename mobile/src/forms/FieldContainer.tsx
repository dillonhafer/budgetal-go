import React from "react";
import { View, StyleSheet } from "react-native";
import { colors } from "@shared/theme";

const FieldContainer = props => {
  return (
    <View
      style={{
        height: 50,
        backgroundColor: "#fff",
        borderColor: "#fff",
        borderBottomColor: colors.borderColor,
        borderWidth: StyleSheet.hairlineWidth,
        paddingLeft: 20,
        borderTopColor:
          props.position === "first" ? colors.borderColor : "#fff",
        alignSelf: "stretch",
        flexDirection: props.children.length > 1 ? "row" : "column",
        alignItems: props.children.length > 1 ? "center" : null,
      }}
    >
      {props.children}
    </View>
  );
};

export default FieldContainer;
