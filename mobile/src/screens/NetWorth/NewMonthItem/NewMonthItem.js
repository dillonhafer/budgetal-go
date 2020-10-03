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
  OptionInput,
} from "@src/forms";

class NewMonthItemScreen extends Component {
  goBack = () => {
    this.props.navigation.goBack();
  };

  state = {
    loading: false,
    amount: 0.0,
  };

  validateFields = () => {
    const { assetId, amount } = this.state;
    return assetId && amount > 0;
  };

  handleOnPress = () => {
    this.setState({ loading: true });
    if (!this.validateFields()) {
      return error("Form is not valid");
    }

    const year = this.props.navigation.getParam("year");
    const month = this.props.navigation.getParam("month");
    const title = this.props.navigation.getParam("title").toUpperCase();

    const { assetId, amount } = this.state;
    const isAsset = title === "ASSET";

    this.props
      .createNetWorthItem({
        year,
        month,
        item: {
          assetId,
          amount,
          isAsset,
        },
      })
      .then(() => {
        this.goBack();
        notice(`${title} SAVED`);
      })
      .catch(() => {
        error(`COULD NOT CREATE ${title}`);
      })
      .then(() => {
        this.setState({ loading: false });
      });
  };

  render() {
    const { amount, loading } = this.state;
    const valid = this.validateFields();

    return (
      <ScrollView
        contentContainerStyle={styles.container}
        {...BlurViewInsetProps}
      >
        <StatusBar barStyle="dark-content" />
        <FieldContainer position="first">
          <OptionInput
            navigation={this.props.navigation}
            options={this.props.navigation.state.params.options}
            placeholder="Select An Item"
            onChange={({ value: assetId, label: name }) =>
              this.setState({ assetId, name })
            }
          />
        </FieldContainer>
        <FieldContainer>
          <MoneyInput
            title="Amount"
            displayAmount={amount}
            defaultValue={(amount * 100).toFixed()}
            onChange={amount => this.setState({ amount })}
          />
        </FieldContainer>

        <View style={{ height: 10 }} />

        <PrimaryButton
          title={`Save ${this.props.navigation.state.params.title}`}
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

export default NewMonthItemScreen;
