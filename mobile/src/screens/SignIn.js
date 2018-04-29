import React, { Component } from 'react';
import {
  TextInput,
  View,
  StyleSheet,
  Text,
  StatusBar,
  TouchableOpacity,
  Image,
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
import {
  PrimaryButton,
  FieldContainer,
  NavigationInputAccessoryView,
} from 'forms';
import colors from 'utils/colors';
import { validEmail } from 'utils/helpers';

import OnePassword from 'react-native-onepassword';
import onepasswordImage from 'images/onepassword.png';
const PASSWORD_DOMAIN = 'budgetal.com';

class SignInScreen extends Component {
  inputs = [];

  state = {
    email: '',
    password: '',
    loading: false,
    onepassword: false,
  };

  componentDidMount() {
    OnePassword.isSupported()
      .then(() => {
        this.setState({ onepassword: true });
      })
      .catch(() => {
        this.setState({ onepassword: false });
      });
  }

  validateFields = () => {
    const { email, password } = this.state;
    return email.length > 0 && validEmail(email) && password.length > 0;
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

  handleOnPress = async () => {
    this.setState({ loading: true });
    try {
      if (this.validateFields()) {
        await this.signIn();
      } else {
        error('Email/Password are invalid');
      }
    } catch (err) {
      // console.log(err)
    } finally {
      this.setState({ loading: false });
    }
  };

  focusEmail = () => {
    this.inputs['email'].focus();
  };

  focusPassword = () => {
    this.inputs['password'].focus();
  };

  navForgotPassword = () => {
    this.props.navigation.navigate('ForgotPassword');
  };

  handleValueFromPasswordExtension = (field, value) => {
    this.setState({ [field]: value });
    this.inputs[field].setNativeProps({
      text: value,
    });
  };

  handleOnePassword = () => {
    OnePassword.findLogin(`https://${PASSWORD_DOMAIN}`)
      .then(credentials => {
        this.handleValueFromPasswordExtension('email', credentials.username);
        this.handleValueFromPasswordExtension('password', credentials.password);
      })
      .catch(() => {
        error('Could not get password from 1password');
      });
  };

  getEmailFromManager = email => {
    this.handleValueFromPasswordExtension('email', email);
  };

  getPasswordFromManager = password => {
    this.handleValueFromPasswordExtension('password', password);
  };

  render() {
    const { loading, onepassword } = this.state;
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
            autoFocus={true}
            keyboardType="email-address"
            style={{ height: 50, flex: 2 }}
            placeholder="Email"
            autoCapitalize={'none'}
            inputAccessoryViewID={'email'}
            underlineColorAndroid={'transparent'}
            autoCorrect={false}
            ref={input => {
              this.inputs['email'] = input;
            }}
            onSubmitEditing={this.focusPassword}
            returnKeyType="next"
            enablesReturnKeyAutomatically={true}
            onChangeText={email => this.setState({ email })}
          />
          <View style={{ paddingHorizontal: 15 }}>
            {onepassword && (
              <TouchableOpacity onPress={this.handleOnePassword}>
                <Image
                  source={onepasswordImage}
                  style={{
                    tintColor: colors.primary,
                    width: 33,
                    height: 33,
                    paddingHorizontal: 5,
                  }}
                />
              </TouchableOpacity>
            )}
          </View>
        </FieldContainer>
        <FieldContainer>
          <TextInput
            style={{ height: 50, flex: 2 }}
            enablesReturnKeyAutomatically={true}
            secureTextEntry={true}
            autoCapitalize={'none'}
            inputAccessoryViewID={'password'}
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
        <NavigationInputAccessoryView input="email" next={this.focusPassword} />
        <NavigationInputAccessoryView input="password" prev={this.focusEmail} />
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

export default connect(null, dispatch => ({
  updateCurrentUser: user => {
    dispatch(updateCurrentUser(user));
  },
}))(SignInScreen);
