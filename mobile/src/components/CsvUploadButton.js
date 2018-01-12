import React, { PureComponent } from 'react';
import { View, TouchableHighlight, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from 'utils/colors';

class CsvUploadButton extends PureComponent {
  render() {
    const { onPress } = this.props;

    return (
      <TouchableHighlight
        style={{
          alignSelf: 'center',
          width: '75%',
          justifyContent: 'center',
        }}
        underlayColor={'#cccccc77'}
        onPress={onPress}
      >
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 2,
            borderColor: colors.lines,
            borderStyle: 'dashed',
            padding: 30,
          }}
        >
          <Ionicons
            name="ios-cloud-upload-outline"
            size={64}
            color={colors.primary}
            style={{
              textAlign: 'center',
            }}
          />
          <Text
            style={{
              textAlign: 'center',
              color: '#333',
              fontSize: 20,
              marginBottom: 20,
            }}
          >
            Touch to import a CSV
          </Text>
          <Text style={{ textAlign: 'center', color: '#ccc' }}>
            File should have three headers:
          </Text>
          <Text
            style={{
              textAlign: 'center',
              color: '#aaa',
              fontWeight: '700',
            }}
          >
            date, description, amount
          </Text>
        </View>
      </TouchableHighlight>
    );
  }
}

export default CsvUploadButton;
