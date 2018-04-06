import React, { Component } from 'react';
import { LayoutAnimation, StyleSheet, ActivityIndicator } from 'react-native';
import { BlurView } from 'expo';
import colors from 'utils/colors';

class Spin extends Component {
  componentDidUpdate() {
    LayoutAnimation.easeInEaseOut();
  }

  spinView() {
    return (
      <BlurView
        tint="light"
        intensity={55}
        style={[
          StyleSheet.absoluteFill,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </BlurView>
    );
  }

  render() {
    return this.props.spinning ? this.spinView() : null;
  }
}

export default Spin;
