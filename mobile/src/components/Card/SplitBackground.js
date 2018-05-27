import React, { PureComponent } from 'react';
import { View, StyleSheet } from 'react-native';

class SplitBackground extends PureComponent {
  render() {
    const { top, bottom } = this.props;
    const topColor = top ? { backgroundColor: top } : {};
    const bottomColor = bottom ? { backgroundColor: bottom } : {};
    return (
      <View>
        <View style={[styles.white, topColor]} />
        <View style={[styles.gray, bottomColor]}>
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
