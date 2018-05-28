import React, { PureComponent } from 'react';
import { View, StyleSheet } from 'react-native';

class FormCard extends PureComponent {
  render() {
    return (
      <View style={styles.container}>
        <View>{this.props.children}</View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 15,
    paddingVertical: 10,
    marginVertical: 10,
    marginHorizontal: 20,
    shadowOffset: { width: 0, height: 3 },
    shadowColor: '#aaa',
    shadowOpacity: 0.3,
  },
});

export default FormCard;
