import React, { PureComponent } from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

class PlusButton extends PureComponent {
  render() {
    const { onPress, disabled } = this.props;
    return (
      <TouchableOpacity onPress={onPress} disabled={disabled}>
        <Ionicons
          name="ios-add-outline"
          size={32}
          color={'#037aff'}
          style={{
            fontWeight: '300',
            paddingRight: 20,
            paddingLeft: 20,
            opacity: disabled ? 0.4 : 1,
          }}
        />
      </TouchableOpacity>
    );
  }
}

export default PlusButton;
