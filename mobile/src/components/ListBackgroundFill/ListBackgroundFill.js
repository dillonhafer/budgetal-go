import React, { PureComponent } from 'react';
import { View, StyleSheet } from 'react-native';

class ListBackgroundFill extends PureComponent {
  render() {
    return <View style={styles.fill} />;
  }
}

const styles = StyleSheet.create({
  fill: {
    ...StyleSheet.absoluteFillObject,
    top: 300,
    backgroundColor: '#d8dce0',
  },
});

export default ListBackgroundFill;
