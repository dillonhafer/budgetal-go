import React, { Component } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  StatusBar,
  ScrollView,
  View,
} from 'react-native';

// API
import { SignOutRequest } from 'api/sessions';
import { RemoveAuthentication, GetCurrentUser } from 'utils/authentication';

// Navigation
import { navigateRoot } from 'navigators';

// Components
import { DangerButton } from 'forms';
import { Ionicons } from '@expo/vector-icons';

class AccountScreen extends Component {
  state = {
    loading: false,
    user: {
      firstName: '',
      lastName: '',
      email: '',
      avatarUrl: '',
    },
  };

  static navigationOptions = {
    title: 'Account Settings',
    tabBarLabel: 'Account',
    tabBarIcon: ({ tintColor }) => (
      <Ionicons name="md-person" size={32} color={tintColor} />
    ),
  };

  componentDidMount() {
    this.loadUser();
  }

  loadUser = async () => {
    try {
      const user = await GetCurrentUser();
      this.setState({ user });
    } catch (err) {
      //
    }
  };

  signOut = async () => {
    try {
      await SignOutRequest();
      await RemoveAuthentication();
      navigateRoot(this.props.navigation.dispatch);
    } catch (err) {}
  };

  confirmSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: this.signOut,
        },
      ],
      { cancelable: true },
    );
  };

  render() {
    const { loading, user } = this.state;
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <StatusBar barStyle="dark-content" />
        <Text
          style={{
            fontSize: 22,
            fontWeight: '900',
            color: '#444',
            marginTop: 20,
          }}
        >
          {user.firstName} {user.lastName} {user.email}
        </Text>

        <DangerButton
          title="Sign Out"
          onPress={this.confirmSignOut}
          loading={loading}
        />
      </ScrollView>
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

export default AccountScreen;
