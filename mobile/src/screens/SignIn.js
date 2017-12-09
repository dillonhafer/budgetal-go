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
import { SignInRequest } from 'api/sessions';
import { SetAuthenticationToken, SetCurrentUser } from 'utils/authentication';

// Helpers
import { error, notice } from 'notify';
import { navigateHome } from 'navigators';

// Components
import { PrimaryButton, FieldContainer } from 'forms';

// tmp
import { GetCurrentUser } from 'utils/authentication';

class SignInScreen extends Component {
  inputs = [];

  state = {
    email: '',
    password: '',
    loading: false,
    u: null,
  };

  componentDidMount() {
    this.loadKeys();
  }

  loadKeys = async () => {
    const u = await GetCurrentUser();
    this.setState({ u });
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
        error('Username/Password are invalid');
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

  renderBudget = () => {
    if (this.state.budget) {
      return <Text>{this.state.budget.income}</Text>;
    }
  };

  render() {
    const { email, password, loading } = this.state;
    return (
      <KeyboardAvoidingView
        behvaior="padding"
        keyboardVerticalOffset={60}
        style={styles.container}
      >
        <StatusBar barStyle="dark-content" />
        <Text
          style={{
            fontSize: 22,
            fontWeight: '900',
            color: '#444',
            marginTop: 20,
          }}
        >
          Sign in
        </Text>
        <Text style={{ fontSize: 22, fontWeight: '900', color: '#444' }}>
          to your account
        </Text>
        <Text style={{ fontSize: 16, margin: 10, color: '#999' }}>
          Welcome back!
        </Text>
        <FieldContainer>
          <TextInput
            keyboardType="email-address"
            style={{ height: 50 }}
            placeholder="Email"
            autoCapitalize={'none'}
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
          loading={loading}
        />
        {this.renderBudget()}
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

export default SignInScreen;
