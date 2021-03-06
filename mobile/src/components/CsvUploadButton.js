import React, { PureComponent } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { colors } from "@shared/theme";
import ImportAnimation from "@src/components/ImportAnimation";

class CsvUploadButton extends PureComponent {
  render() {
    const { onPress } = this.props;

    return (
      <TouchableOpacity
        style={{
          alignSelf: "center",
          width: "75%",
          height: "100%",
          justifyContent: "center",
        }}
        activeOpacity={0.4}
        onPress={onPress}
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 2,
            borderColor: colors.lines,
            borderStyle: "dashed",
            padding: 30,
          }}
        >
          <ImportAnimation />
          <Text
            style={{
              textAlign: "center",
              color: "#333",
              fontSize: 20,
              marginBottom: 20,
            }}
          >
            Press to import a CSV
          </Text>
          <Text style={{ textAlign: "center", color: "#ccc" }}>
            File should have three headers:
          </Text>
          <Text
            style={{
              textAlign: "center",
              color: "#aaa",
              fontWeight: "700",
            }}
          >
            date, description, amount
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

export default CsvUploadButton;
