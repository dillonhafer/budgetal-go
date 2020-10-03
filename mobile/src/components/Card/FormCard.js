import React, { PureComponent } from "react";
import { View, StyleSheet } from "react-native";

class FormCard extends PureComponent {
  render() {
    return (
      <View style={styles.container}>
        <View>{this.props.children}</View>
      </View>
    );
  }
}

export const DarkFormCard = React.memo(({ children }) => {
  return (
    <View style={styles.darkContainer}>
      <View>{children}</View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 6,
    padding: 15,
    paddingVertical: 10,
    marginVertical: 10,
    marginHorizontal: 20,
    shadowOffset: { width: 0, height: 3 },
    shadowColor: "#aaa",
    shadowOpacity: 0.3,
  },
  darkContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    paddingVertical: 10,
    marginVertical: 10,
    marginHorizontal: 20,
    shadowOffset: { wdth: 0, height: 5 },
    shadowColor: "#aaa",
    shadowOpacity: 0.6,
  },
});

export default FormCard;
