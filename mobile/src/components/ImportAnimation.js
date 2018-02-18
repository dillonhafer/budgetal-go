import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { DangerZone } from 'expo';
const { Lottie } = DangerZone;
import { importJson } from 'assets/import';

class MoneyAnimation extends Component {
  componentDidMount() {
    setTimeout(this.playAnimation, 500);
  }

  playAnimation = () => {
    if (this.animation) {
      this.animation.reset();
      this.animation.play();
    }
  };

  render() {
    return (
      <View style={styles.animationContainer}>
        <Lottie
          ref={animation => {
            this.animation = animation;
          }}
          style={{
            width: 200,
            height: 200,
            backgroundColor: 'transparent',
          }}
          source={importJson}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  animationContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MoneyAnimation;
