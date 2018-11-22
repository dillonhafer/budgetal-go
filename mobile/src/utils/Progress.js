import React, { PureComponent } from 'react';
import { View } from 'react-native';
import { colors } from '@shared/theme';

export default class Progress extends PureComponent {
  render() {
    const { status, percent } = this.props;
    let color = colors.primary;
    if (status) {
      switch (status) {
        case 'normal':
          color = colors.primary;
          break;
        case 'exception':
          color = colors.error;
          break;
        case 'success':
          color = colors.success;
          break;
      }
    } else {
      if (percent > 100) {
        color = colors.error;
      }
      if (percent === 100) {
        color = colors.success;
      }
    }

    return (
      <View
        style={{
          justifyContent: 'center',
          backgroundColor: '#f1f1f1',
          borderColor: '#f1f1f1',
          borderWidth: 1,
          borderRadius: 10,
          height: 20,
          width: '100%',
        }}
      >
        <View
          style={{
            backgroundColor: color,
            borderColor: color,
            borderRadius: 10,
            borderWidth: 0,
            height: 20,
            width: `${percent}%`,
          }}
        />
      </View>
    );
  }
}
