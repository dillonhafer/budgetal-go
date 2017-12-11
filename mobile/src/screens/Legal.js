import React, { Component } from 'react';
import { StyleSheet, Text, StatusBar, View } from 'react-native';

// Components
import { Ionicons } from '@expo/vector-icons';

class LegalScreen extends Component {
  static navigationOptions = {
    title: 'Legal',
  };

  render() {
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
          ---
        </Text>
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

export default LegalScreen;
