import React, { Component } from 'react';
import {
  TextInput,
  StyleSheet,
  Text,
  StatusBar,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';

// API
import { PasswordResetRequest } from 'api/users';

// Helpers
import { error, notice } from 'notify';
import { navigateRoot } from 'navigators';

// Components
import { PrimaryButton, FieldContainer } from 'forms';
import colors from 'utils/colors';
import { validEmail } from 'utils/helpers';

class ForgotPasswordScreen extends Component {
  state = {
    email: '',
    loading: false,
  };

  validateFields = () => {
    const { email } = this.state;
    return email.length > 0 && validEmail(email);
  };

  resetPassword = async () => {
    const { email } = this.state;
    const resp = await PasswordResetRequest({ email });
    if (resp && resp.ok) {
      navigateRoot(this.props.navigation.dispatch);
      notice(
        'We sent you an email with instructions on resetting your password',
      );
    }
  };

  handleOnPress = async () => {
    this.setState({ loading: true });
    try {
      if (this.validateFields()) {
        await this.resetPassword();
      } else {
        error('Email is invalid');
      }
    } catch (err) {
      // console.log(err)
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const { email, loading } = this.state;
    const valid = this.validateFields();

    return (
      <KeyboardAvoidingView
        behvaior="padding"
        keyboardVerticalOffset={60}
        style={styles.container}
      >
        <StatusBar barStyle="dark-content" />
        <Text style={{ fontSize: 16, margin: 10, color: '#999' }}>
          Request a password reset
        </Text>
        <FieldContainer position="first">
          <TextInput
            autoFocus={true}
            keyboardType="email-address"
            style={{ height: 50 }}
            placeholder="Email"
            underlineColorAndroid={'transparent'}
            autoCapitalize={'none'}
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={this.handleOnPress}
            enablesReturnKeyAutomatically={true}
            onChangeText={email => this.setState({ email })}
          />
        </FieldContainer>

        <PrimaryButton
          title="Request Password Reset"
          onPress={this.handleOnPress}
          loading={!valid || loading}
        />
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ececec',
    alignItems: 'center',
    flexDirection: 'column',
  },
});

export default ForgotPasswordScreen;
