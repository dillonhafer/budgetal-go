import React, { PureComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MoneyAnimation from 'components/MoneyAnimation';

class EmptyList extends PureComponent {
  render() {
    const { message } = this.props;
    return (
      <View style={styles.container}>
        <MoneyAnimation />
        <Text style={styles.message}>{message}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  message: {
    margin: 5,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default EmptyList;
