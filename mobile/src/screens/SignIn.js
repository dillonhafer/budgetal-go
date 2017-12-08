import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

class SignInScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Sign In to Bugetal!!</Text>
      </View>
    );
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

export default SignInScreen;
