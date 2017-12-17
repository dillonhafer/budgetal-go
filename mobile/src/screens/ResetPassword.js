import React, { Component } from 'react';
import {
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Text,
  StatusBar,
  Image,
  View,
  KeyboardAvoidingView,
} from 'react-native';

// API
import { ResetPasswordRequest } from 'api/users';

// Helpers
import { error, notice } from 'notify';
import { navigateRoot } from 'navigators';

// Components
import { PrimaryButton, FieldContainer } from 'forms';
import colors from 'utils/colors';

class ResetPasswordScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const onPress = () => {
      navigateRoot(navigation.dispatch);
    };
    return {
      headerLeft: (
        <TouchableOpacity onPress={onPress}>
          <Text style={{ padding: 10, color: colors.error }}>Cancel</Text>
        </TouchableOpacity>
      ),
    };
  };

  inputs = [];

  state = {
    password: '',
    passwordConfirmation: '',
    loading: false,
  };

  goHome = () => {
    navigateRoot(this.props.navigation.dispatch);
  };

  validateFields = () => {
    const { password, passwordConfirmation } = this.state;
    return (
      password.length > 0 &&
      passwordConfirmation.length > 0 &&
      password === passwordConfirmation
    );
  };

  resetPassword = async () => {
    try {
      const { password } = this.state;
      const reset_password_token = this.props.navigation.state.params
        .resetPasswordToken;
      const resp = await ResetPasswordRequest({
        password,
        reset_password_token,
      });
      if (resp && resp.ok) {
        this.goHome();
        notice('Your password has been reset!');
      }
    } catch (err) {
      error('You password reset token may have expired');
    }
  };

  handleOnPress = () => {
    this.setState({ loading: true });
    try {
      if (this.validateFields()) {
        this.resetPassword();
      } else {
        error('Password does not match confirmation');
      }
    } catch (err) {
      error('You password reset token may have expired');
    } finally {
      this.setState({ loading: false });
    }
  };

  focusNextField(key) {
    this.inputs[key].focus();
  }

  render() {
    const { loading } = this.state;
    const valid = this.validateFields();

    return (
      <KeyboardAvoidingView
        behvaior="padding"
        keyboardVerticalOffset={60}
        style={styles.container}
      >
        <StatusBar barStyle="dark-content" />
        <Text style={{ fontSize: 16, margin: 10, color: '#999' }}>
          Create a new password
        </Text>
        <FieldContainer>
          <TextInput
            style={{ height: 50 }}
            enablesReturnKeyAutomatically={true}
            secureTextEntry={true}
            autoCapitalize={'none'}
            underlineColorAndroid={'transparent'}
            ref={input => {
              this.inputs['password'] = input;
            }}
            placeholder="Password"
            returnKeyType="next"
            onSubmitEditing={_ => {
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
            autoCapitalize={'none'}
            underlineColorAndroid={'transparent'}
            ref={input => {
              this.inputs['passwordConfirmation'] = input;
            }}
            placeholder="Password Confirmation"
            returnKeyType="done"
            onSubmitEditing={this.handleOnPress}
            onChangeText={passwordConfirmation =>
              this.setState({ passwordConfirmation })}
          />
        </FieldContainer>
        <PrimaryButton
          title="Reset Password"
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

export default ResetPasswordScreen;
