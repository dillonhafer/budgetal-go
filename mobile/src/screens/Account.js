import React, { Component } from 'react';
import { Alert, StyleSheet, Text, StatusBar, View } from 'react-native';

// API
import { SignOutRequest } from 'api/sessions';
import { RemoveAuthentication } from 'utils/authentication';

// Navigation
import { navigateRoot } from 'navigators';

// Components
import { DangerButton } from 'forms';
import { Ionicons } from '@expo/vector-icons';

class AccountScreen extends Component {
  state = {
    loading: false,
  };

  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => (
      <Ionicons name="md-person" size={32} color={tintColor} />
    ),
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
    const { loading } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <Text
          style={{
            fontSize: 22,
            fontWeight: '900',
            color: '#444',
            marginTop: 20,
          }}
        >
          Account Settings
        </Text>

        <DangerButton
          title="Sign Out"
          onPress={this.confirmSignOut}
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

export default AccountScreen;
