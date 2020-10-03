import React, { PureComponent } from "react";

import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { currencyf } from "@shared/helpers";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MoneyInputModal from "@src/forms/MoneyInputModal";

class MoneyInput extends PureComponent {
  state = {
    showMoneyPicker: false,
  };

  showMoneyPicker = () => {
    this.setState({ showMoneyPicker: true });
  };

  hideMoneyPicker = () => {
    this.setState({ showMoneyPicker: false });
  };

  handleOnSubmit = number => {
    this.hideMoneyPicker();
    this.props.onChange(number);
  };

  render() {
    const { defaultValue, displayAmount, title } = this.props;
    const { showMoneyPicker } = this.state;

    return (
      <TouchableOpacity
        style={styles.amountButton}
        onPress={this.showMoneyPicker}
      >
        <View>
          <Text style={styles.displayAmount}>{currencyf(displayAmount)}</Text>
          <MoneyInputModal
            defaultValue={defaultValue}
            title={title || "Enter Amount"}
            visible={showMoneyPicker}
            onOk={this.handleOnSubmit}
            onCancel={this.hideMoneyPicker}
          />
        </View>
        <MaterialCommunityIcons
          name="chevron-right"
          size={22}
          style={{ paddingRight: 10 }}
          color={"#ced0ce"}
        />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  amountButton: {
    height: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default MoneyInput;
