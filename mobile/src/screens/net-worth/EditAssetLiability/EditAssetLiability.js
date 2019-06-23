import React, { Component } from "react";
import {
  TextInput,
  StyleSheet,
  StatusBar,
  View,
  ScrollView,
} from "react-native";

// Helpers
import { BlurViewInsetProps } from "@src/utils/navigation-helpers";
import { error, notice } from "@src/notify";

// Components
import { PrimaryButton, DangerButton, FieldContainer } from "@src/forms";
import Device from "@src/utils/Device";
const isTablet = Device.isTablet();

class EditAssetLiabilityScreen extends Component {
  goBack = () => {
    if (isTablet) {
      this.props.screenProps.goBack();
    } else {
      this.props.navigation.goBack();
    }
  };

  state = {
    loading: false,
  };

  validateFields = () => {
    const { name } = this.state;
    return name && name.length > 0;
  };

  handleOnPress = () => {
    this.setState({ loading: true });
    if (!this.validateFields()) {
      return error("Form is not valid");
    }

    const { name } = this.state;
    const asset = this.props.navigation.getParam("item");
    const title = asset.isAsset ? "ASSET" : "LIABILITY";

    this.props
      .updateAssetLiability({ ...asset, name })
      .then(() => {
        this.goBack();
        notice(`${title} SAVED`);
      })
      .catch(() => {
        error(`COULD NOT UPDATE ${title}`);
      })
      .then(() => {
        this.setState({ loading: false });
      });
  };

  render() {
    const item = this.props.navigation.getParam("item");
    const { name = item.name, loading } = this.state;
    const valid = this.validateFields();

    return (
      <ScrollView
        contentContainerStyle={styles.container}
        {...BlurViewInsetProps}
      >
        <StatusBar barStyle="dark-content" />
        <FieldContainer position="first">
          <TextInput
            style={{ height: 50 }}
            placeholder="Name"
            defaultValue={name}
            returnKeyType="done"
            onSubmitEditing={this.handleOnPress}
            underlineColorAndroid={"transparent"}
            onChangeText={name => this.setState({ name })}
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

export default EditAssetLiabilityScreen;
