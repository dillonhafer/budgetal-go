import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import RootNavigator from 'navigators/root';

export default class App extends Component {
  render() {
    return <RootNavigator />;
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
