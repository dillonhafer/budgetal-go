import React, { PureComponent } from 'react';
import { View, StyleSheet } from 'react-native';

class SplitBackground extends PureComponent {
  render() {
    return (
      <View>
        <View style={styles.white} />
        <View style={styles.gray}>
          <View style={styles.negativeMargin}>{this.props.children}</View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  white: {
    height: 100,
    backgroundColor: '#ffffff',
    zIndex: 0,
  },
  gray: {
    zIndex: 1,
    backgroundColor: '#d8dce0',
  },
  negativeMargin: {
    marginTop: -90,
  },
});

export default SplitBackground;
