import React, { Component } from "react";
import { StyleSheet, StatusBar, View, ScrollView } from "react-native";

// Helpers
import { BlurViewInsetProps } from "@src/utils/navigation-helpers";
import { error, notice } from "@src/notify";

// Components
import {
  PrimaryButton,
  DangerButton,
  FieldContainer,
  MoneyInput,
} from "@src/forms";

class EditMonthItemScreen extends Component {
  goBack = () => {
    this.props.navigation.goBack();
  };

  state = {
    loading: false,
  };

  validateFields = () => {
    const { amount } = this.state;
    return amount && amount > 0;
  };

  handleOnPress = () => {
    this.setState({ loading: true });
    if (!this.validateFields()) {
      return error("Form is not valid");
    }

    const item = this.props.navigation.getParam("item");
    const name = item.name.toUpperCase();
    const { amount } = this.state;

    this.props
      .updateNetWorthItem({
        item: {
          ...item,
          amount,
        },
      })
      .then(() => {
        this.goBack();
        notice(`${name} SAVED`);
      })
      .catch(() => {
        error(`COULD NOT SAVE ${name}`);
      })
      .then(() => {
        this.setState({ loading: false });
      });
  };

  render() {
    const item = this.props.navigation.getParam("item");
    const { amount = item.amount, loading } = this.state;
    const valid = this.validateFields();

    return (
      <ScrollView
        contentContainerStyle={styles.container}
        {...BlurViewInsetProps}
      >
        <StatusBar barStyle="dark-content" />
        <FieldContainer position="first">
          <MoneyInput
            title="Item Amount"
            displayAmount={amount}
            defaultValue={(amount * 100).toFixed()}
            onChange={amount => this.setState({ amount })}
          />
        </FieldContainer>

        <View style={{ height: 10 }} />

        <PrimaryButton
          title={`Save`}
          onPress={this.handleOnPress}
          loading={!valid || loading}
        />

        <DangerButton title="Cancel" onPress={this.goBack} />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    alignItems: "center",
    flexDirection: "column",
    paddingBottom: 40,
    paddingTop: 15,
  },
});

export default EditMonthItemScreen;
