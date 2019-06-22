import React, { PureComponent } from 'react';
import { View, StyleSheet } from 'react-native';
import Lottie from 'lottie-react-native';
import { pieChartJson } from 'assets/pie-chart';

class PieAnimation extends PureComponent {
  componentDidMount() {
    this.playAnimation();
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
          source={pieChartJson}
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

export default PieAnimation;
