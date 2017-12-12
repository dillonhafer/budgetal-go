import React, { Component } from 'react';
import { StyleSheet, Text, TextInput, StatusBar, View } from 'react-native';

// Redux
import { connect } from 'react-redux';
import { updateCurrentUser } from 'actions/users';

// API
import { UpdateAccountInfoRequest } from 'api/users';

// Helpers
import { error, notice } from 'notify';

// Components
import { PrimaryButton, FieldContainer } from 'forms';
import { SetCurrentUser } from 'utils/authentication';

class AccountEditScreen extends Component {
  static navigationOptions = {
    title: 'Account Edit',
  };

  inputs = [];

  state = {
    email: '',
    firstName: '',
    lastName: '',
    currentPassword: '',
    loading: false,
  };

  componentDidMount() {
    const {
      email,
      firstName,
      lastName,
    } = this.props.navigation.state.params.user;
    this.setState({ email, firstName, lastName });
  }

  validateFields = () => {
    const { currentPassword, email, firstName, lastName } = this.state;
    return (
      email.length > 0 &&
      firstName.length > 0 &&
      lastName.length > 0 &&
      currentPassword.length > 0
    );
  };

  focusNextField(key) {
    this.inputs[key].focus();
  }

  updateAccountInfo = async () => {
    const { email, firstName, lastName, currentPassword } = this.state;

    let data = new FormData();
    data.append('firstName', firstName);
    data.append('lastName', lastName);
    data.append('email', email);
    data.append('password', currentPassword);
    if (this.state.file) {
      data.append('avatar', this.state.file);
    }

    const resp = await UpdateAccountInfoRequest(data);
    if (resp && resp.ok) {
      notice('Account Updated');
      this.props.updateCurrentUser(resp.user);
      SetCurrentUser(resp.user);
      this.props.navigation.goBack();
    }
  };

  handleOnPress = () => {
    this.setState({ loading: true });
    try {
      if (this.validateFields()) {
        this.updateAccountInfo();
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
    const { email, firstName, lastName, loading } = this.state;

    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={{ height: 30 }} />
        <FieldContainer>
          <TextInput
            keyboardType="email-address"
            style={{ height: 50 }}
            placeholder="Email"
            autoCapitalize={'none'}
            defaultValue={email}
            autoCorrect={false}
            ref={input => {
              this.inputs['email'] = input;
            }}
            onSubmitEditing={_ => {
              this.focusNextField('firstName');
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
            ref={input => {
              this.inputs['firstName'] = input;
            }}
            placeholder="First Name"
            defaultValue={firstName}
            returnKeyType="next"
            onSubmitEditing={_ => {
              this.focusNextField('lastName');
            }}
            onChangeText={firstName => this.setState({ firstName })}
          />
        </FieldContainer>
        <FieldContainer>
          <TextInput
            style={{ height: 50 }}
            enablesReturnKeyAutomatically={true}
            ref={input => {
              this.inputs['lastName'] = input;
            }}
            placeholder="Last Name"
            defaultValue={lastName}
            returnKeyType="next"
            onSubmitEditing={_ => {
              this.focusNextField('currentPassword');
            }}
            onChangeText={lastName => this.setState({ lastName })}
          />
        </FieldContainer>

        <View style={{ height: 10 }} />
        <FieldContainer>
          <TextInput
            style={{ height: 50 }}
            enablesReturnKeyAutomatically={true}
            secureTextEntry={true}
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
          title="Update Account Info"
          onPress={this.handleOnPress}
          loading={loading}
        />
      </View>
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
  state => ({
    user: state.users,
  }),
  dispatch => ({
    updateCurrentUser: user => {
      dispatch(updateCurrentUser(user));
    },
  }),
)(AccountEditScreen);
