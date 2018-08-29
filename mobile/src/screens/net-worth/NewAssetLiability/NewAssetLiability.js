import React, { Component } from 'react';
import {
  StyleSheet,
  TextInput,
  StatusBar,
  View,
  ScrollView,
} from 'react-native';
import PropTypes from 'prop-types';

// Helpers
import { BlurViewInsetProps } from 'utils/navigation-helpers';
import { error, notice } from 'notify';

// Components
import { PrimaryButton, DangerButton, FieldContainer } from 'forms';

class NewAssetLiabilityScreen extends Component {
  static propTypes = {
    screenProps: PropTypes.object,
    navigation: PropTypes.object,
    createAssetLiability: PropTypes.func,
  };

  goBack = () => {
    this.props.screenProps.goBack();
  };

  inputs = [];

  state = {
    loading: false,
    showMoneyKeyboard: false,
    name: null,
    asset: {
      name: '',
      isAsset: true,
    },
  };

  validateFields = () => {
    const {
      asset: { name },
    } = this.state;
    return name && name.length > 0;
  };

  handleOnPress = () => {
    this.setState({ loading: true });
    if (!this.validateFields()) {
      return error('Form is not valid');
    }

    const { asset } = this.state;
    const title = this.props.navigation.getParam('title');
    const isAsset = title === 'ASSET';

    this.props
      .createAssetLiability({
        name: asset.name,
        isAsset,
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
    const { asset, loading } = this.state;
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
            defaultValue={asset.name}
            returnKeyType="done"
            onSubmitEditing={this.handleOnPress}
            underlineColorAndroid={'transparent'}
            onChangeText={name =>
              this.setState({ asset: { ...this.state.asset, name } })
            }
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
    backgroundColor: 'transparent',
    alignItems: 'center',
    flexDirection: 'column',
    paddingBottom: 40,
    paddingTop: 15,
  },
});

export default NewAssetLiabilityScreen;
