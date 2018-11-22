import React, { Component } from 'react';
import { TextInput, View, StyleSheet, TouchableOpacity } from 'react-native';

// API
import { SignInRequest } from 'api/sessions';
import { SetAuthenticationToken, SetCurrentUser } from 'utils/authentication';

// Helpers
import { error, notice } from 'notify';
import { navigateHome } from 'navigators';

// Components
import { PrimarySquareButton } from 'forms';
import { colors } from '@shared/theme';
import { validEmail } from '@shared/helpers';
import { FormCard, SplitBackground } from 'components/Card';
import { Label } from 'components/Text';

class SignInScreen extends Component {
  inputs = [];

  state = {
    email: '',
    password: '',
    loading: false,
  };

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
    } else {
      this.setState({ loading: false });
    }
  };

  handleOnPress = async () => {
    const valid = this.validateFields();
    if (!valid || this.state.loading) return;

    this.setState({ loading: true });
    try {
      if (valid) {
        await this.signIn();
      } else {
        error('Email/Password are invalid');
      }
    } catch (err) {
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

  render() {
    const { loading } = this.state;
    const valid = this.validateFields();
    return (
      <SplitBackground top={colors.primary} bottom={'#fff'}>
        <View style={{ alignItems: 'center' }}>
          <View style={{ width: '100%', maxWidth: 350 }}>
            <FormCard>
              <View style={{ marginTop: 10 }}>
                <Label style={styles.label}>EMAIL</Label>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <TextInput
                    keyboardType="email-address"
                    style={styles.input}
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
                </View>
                <Label style={styles.label}>PASSWORD</Label>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <TextInput
                    style={styles.input}
                    enablesReturnKeyAutomatically={true}
                    secureTextEntry={true}
                    autoCapitalize={'none'}
                    inputAccessoryViewID={'password'}
                    underlineColorAndroid={'transparent'}
                    ref={input => {
                      this.inputs['password'] = input;
                    }}
                    returnKeyType="done"
                    onSubmitEditing={this.handleOnPress}
                    onChangeText={password => this.setState({ password })}
                  />
                </View>
                <TouchableOpacity
                  style={styles.forgotPasswordButton}
                  onPress={this.navForgotPassword}
                >
                  <Label style={styles.forgotPasswordText}>
                    FORGOT PASSWORD
                  </Label>
                </TouchableOpacity>
              </View>
            </FormCard>
            <PrimarySquareButton
              onPress={this.handleOnPress}
              loading={!valid || loading}
              title="sign in"
            />
          </View>
        </View>
      </SplitBackground>
    );
  }
}

const styles = StyleSheet.create({
  forgotPasswordButton: {
    padding: 3,
  },
  forgotPasswordText: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: '700',
    textAlign: 'right',
  },
  input: {
    flex: 1,
    marginBottom: 10,
    borderRadius: 3,
    height: 40,
    backgroundColor: '#eee',
    paddingLeft: 10,
  },
  label: {
    color: '#aaa',
    fontWeight: 'bold',
    fontSize: 11,
    padding: 5,
  },
});

export default SignInScreen;
