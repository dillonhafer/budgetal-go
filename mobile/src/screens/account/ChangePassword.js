import React, { Component } from 'react';
import {
  StyleSheet,
  TextInput,
  StatusBar,
  ScrollView,
  View,
} from 'react-native';

// API
import { ChangePasswordRequest } from 'api/users';

// Helpers
import { error, notice } from 'notify';
import { colors } from '@shared/theme';
import { BlurViewInsetProps } from 'utils/navigation-helpers';

// Components
import { PrimaryButton, FieldContainer } from 'forms';

class ChangePasswordScreen extends Component {
  static navigationOptions = {
    title: 'Change Password',
  };

  inputs = [];

  state = {
    password: '',
    passwordConfirmation: '',
    currentPassword: '',
    loading: false,
  };

  validateFields = () => {
    const { currentPassword, password, passwordConfirmation } = this.state;
    return (
      password.length > 0 &&
      currentPassword.length > 0 &&
      passwordConfirmation.length > 0 &&
      password === passwordConfirmation
    );
  };

  focusNextField(key) {
    this.inputs[key].focus();
  }

  changePassword = async () => {
    const { password, currentPassword } = this.state;
    const resp = await ChangePasswordRequest({ password, currentPassword });
    if (resp && resp.ok) {
      this.clearInputs();
      notice(resp.message);
      this.props.navigation.goBack();
    }
  };

  clearInputs = () => {
    this.inputs['password'].clear();
    this.inputs['passwordConfirmation'].clear();
    this.inputs['currentPassword'].clear();
  };

  handleOnPress = () => {
    this.setState({ loading: true });
    try {
      if (this.validateFields()) {
        this.changePassword();
      } else {
        error('Form is not valid');
      }
    } catch (err) {
      // console.log(err)
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const { loading } = this.state;
    return (
      <ScrollView
        contentContainerStyle={styles.container}
        {...BlurViewInsetProps}
      >
        <StatusBar barStyle="dark-content" />
        <View style={{ height: 30 }} />
        <FieldContainer position="first">
          <TextInput
            style={{ height: 50 }}
            enablesReturnKeyAutomatically={true}
            secureTextEntry={true}
            underlineColorAndroid={'transparent'}
            autoCapitalize={'none'}
            ref={input => {
              this.inputs['password'] = input;
            }}
            placeholder="Password"
            returnKeyType="next"
            onSubmitEditing={() => {
              this.focusNextField('passwordConfirmation');
            }}
            onChangeText={password => this.setState({ password })}
          />
        </FieldContainer>
        <FieldContainer>
          <TextInput
            style={{ height: 50 }}
            enablesReturnKeyAutomatically={true}
            secureTextEntry={true}
            underlineColorAndroid={'transparent'}
            autoCapitalize={'none'}
            ref={input => {
              this.inputs['passwordConfirmation'] = input;
            }}
            placeholder="Password Confirmation"
            returnKeyType="next"
            onSubmitEditing={() => {
              this.focusNextField('currentPassword');
            }}
            onChangeText={passwordConfirmation =>
              this.setState({ passwordConfirmation })
            }
          />
        </FieldContainer>

        <View style={{ height: 10 }} />
        <FieldContainer position="first">
          <TextInput
            style={{ height: 50 }}
            enablesReturnKeyAutomatically={true}
            secureTextEntry={true}
            underlineColorAndroid={'transparent'}
            autoCapitalize={'none'}
            ref={input => {
              this.inputs['currentPassword'] = input;
            }}
            placeholder="Current Password"
            returnKeyType="done"
            onSubmitEditing={this.handleOnPress}
            onChangeText={currentPassword => this.setState({ currentPassword })}
          />
        </FieldContainer>

        <PrimaryButton
          title="Change Password"
          onPress={this.handleOnPress}
          loading={loading}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    flexDirection: 'column',
  },
});

export default ChangePasswordScreen;
