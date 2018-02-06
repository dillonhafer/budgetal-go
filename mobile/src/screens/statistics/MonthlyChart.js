import React, { PureComponent } from 'react';
import { View, Text } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import colors from 'utils/colors';

class MonthlyChart extends PureComponent {
  render() {
    return (
      <View
        style={{
          borderColor: '#fff',
          borderRadius: 10,
          margin: 30,
          backgroundColor: '#fff',
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            color: colors.primary,
            fontSize: 24,
            fontWeight: '700',
            textAlign: 'center',
            marginBottom: 20,
          }}
        >
          Charts for Tablets coming soon!
        </Text>
        <Ionicons name="ios-pie" size={64} color={colors.primary} />
      </View>
    );
  }
}

export default MonthlyChart;
