import React, { Component } from 'react';
import {
  TextInput,
  StyleSheet,
  Text,
  StatusBar,
  KeyboardAvoidingView,
} from 'react-native';

// Redux
import { connect } from 'react-redux';
import { updateCurrentUser } from 'actions/users';

// API
import { RegisterRequest } from 'api/users';
import { SetAuthenticationToken, SetCurrentUser } from 'utils/authentication';

// Helpers
import { error, notice } from 'notify';
import { navigateHome } from 'navigators';

// Components
import { PrimaryButton, FieldContainer } from 'forms';
import { validEmail } from '@shared/helpers';

class RegisterScreen extends Component {
  inputs = [];

  state = {
    email: '',
    password: '',
    passwordConfirmation: '',
    loading: false,
  };

  validateFields = () => {
    const { email, password, passwordConfirmation } = this.state;
    return (
      email.length > 0 &&
      validEmail(email) &&
      password.length > 0 &&
      passwordConfirmation.length > 0 &&
      password === passwordConfirmation
    );
  };

  register = async () => {
    const { email, password } = this.state;
    const resp = await RegisterRequest({ email, password });
    if (resp && resp.ok) {
      SetAuthenticationToken(resp.token);
      this.props.updateCurrentUser(resp.user);
      SetCurrentUser(resp.user);
      navigateHome(this.props.navigation.dispatch);
      notice('Welcome to Budgetal!');
    }
  };

  handleOnPress = async () => {
    this.setState({ loading: true });
    try {
      if (this.validateFields()) {
        await this.register();
      } else {
        error('Email/Password are invalid');
      }
    } catch (err) {
      // console.log(err)
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
          Welcome to Budgetal!
        </Text>
        <FieldContainer position="first">
          <TextInput
            autoFocus={true}
            keyboardType="email-address"
            underlineColorAndroid={'transparent'}
            style={{ height: 50 }}
            placeholder="Email"
            autoCapitalize={'none'}
            autoCorrect={false}
            ref={input => {
              this.inputs['email'] = input;
            }}
            onSubmitEditing={() => {
              this.focusNextField('password');
            }}
            returnKeyType="next"
            enablesReturnKeyAutomatically={true}
            onChangeText={email => this.setState({ email: email.trim() })}
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
            autoCapitalize={'none'}
            underlineColorAndroid={'transparent'}
            ref={input => {
              this.inputs['passwordConfirmation'] = input;
            }}
            placeholder="Password Confirmation"
            returnKeyType="done"
            onSubmitEditing={this.handleOnPress}
            onChangeText={passwordConfirmation =>
              this.setState({ passwordConfirmation })
            }
          />
        </FieldContainer>
        <PrimaryButton
          title="Register"
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

export default connect(
  null,
  dispatch => ({
    updateCurrentUser: user => {
      dispatch(updateCurrentUser(user));
    },
  }),
)(RegisterScreen);
