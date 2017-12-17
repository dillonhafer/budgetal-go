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

// Redux
import { connect } from 'react-redux';
import { updateCurrentUser } from 'actions/users';

// API
import { SignInRequest } from 'api/sessions';
import { SetAuthenticationToken, SetCurrentUser } from 'utils/authentication';

// Helpers
import { error, notice } from 'notify';
import { navigateHome } from 'navigators';

// Components
import { PrimaryButton, FieldContainer } from 'forms';
import colors from 'utils/colors';

class SignInScreen extends Component {
  inputs = [];

  state = {
    email: '',
    password: '',
    loading: false,
  };

  validateFields = () => {
    const { email, password } = this.state;
    return email.length > 0 && password.length > 0;
  };

  signIn = async () => {
    const { email, password } = this.state;
    const resp = await SignInRequest({ email, password });
    if (resp && resp.ok) {
      SetAuthenticationToken(resp.token);
      this.props.updateCurrentUser(resp.user);
      SetCurrentUser(resp.user);
      navigateHome(this.props.navigation.dispatch);
      notice('You are now signed in!');
    }
  };

  handleOnPress = () => {
    this.setState({ loading: true });
    try {
      if (this.validateFields()) {
        this.signIn();
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

  navForgotPassword = () => {
    this.props.navigation.navigate('ForgotPassword');
  };

  render() {
    const { email, password, loading } = this.state;
    const valid = this.validateFields();
    return (
      <KeyboardAvoidingView
        behvaior="padding"
        keyboardVerticalOffset={60}
        style={styles.container}
      >
        <StatusBar barStyle="dark-content" />
        <Text style={{ fontSize: 16, margin: 10, color: '#999' }}>
          Welcome back!
        </Text>
        <FieldContainer position="first">
          <TextInput
            keyboardType="email-address"
            style={{ height: 50 }}
            placeholder="Email"
            autoCapitalize={'none'}
            underlineColorAndroid={'transparent'}
            autoCorrect={false}
            ref={input => {
              this.inputs['email'] = input;
            }}
            onSubmitEditing={_ => {
              this.focusNextField('password');
            }}
            returnKeyType="next"
            enablesReturnKeyAutomatically={true}
            onChangeText={email => this.setState({ email })}
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
            returnKeyType="done"
            onSubmitEditing={this.handleOnPress}
            onChangeText={password => this.setState({ password })}
          />
        </FieldContainer>
        <PrimaryButton
          title="Sign In"
          onPress={this.handleOnPress}
          loading={!valid || loading}
        />
        <TouchableOpacity
          style={styles.forgotPasswordLink}
          onPress={this.navForgotPassword}
        >
          <Text style={styles.forgotPasswordText}>Forgot password</Text>
        </TouchableOpacity>
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
  forgotPasswordText: {
    textAlign: 'left',
    color: colors.primary,
  },
  forgotPasswordLink: {
    alignSelf: 'flex-end',
    marginTop: 10,
    padding: 10,
    paddingRight: 20,
  },
});

export default connect(
  state => ({}),
  dispatch => ({
    updateCurrentUser: user => {
      dispatch(updateCurrentUser(user));
    },
  }),
)(SignInScreen);
