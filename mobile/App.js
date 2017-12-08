import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import SignInScreen from 'screens/SignIn';

export default class App extends Component {
  render() {
    return <SignInScreen />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
