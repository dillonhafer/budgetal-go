import React, { PureComponent } from "react";
import { View, Text, StyleSheet, Switch } from "react-native";
import { colors } from "@shared/theme";

class SwitchInput extends PureComponent {
  state = {
    internalValue: null,
  };

  onValueChange = ({ internalValue }) => {
    this.setState({ internalValue });
    this.props.onChange(internalValue);
  };

  render() {
    const { defaultValue, label, onTintColor } = this.props;
    const { internalValue } = this.state;
    const selectedValue = internalValue || defaultValue || false;

    return (
      <View style={{ width: "100%", flexDirection: "column" }}>
        <View style={styles.row}>
          <View>
            <Text style={styles.displayLabel}>{label}</Text>
          </View>
          <Switch
            style={styles.switch}
            value={selectedValue}
            trackColor={{ true: onTintColor || colors.primary }}
            onValueChange={internalValue =>
              this.onValueChange({ internalValue })
            }
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    height: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  displayLabel: {
    marginLeft: 20,
  },
  switch: {
    marginRight: 15,
  },
});

export default SwitchInput;
