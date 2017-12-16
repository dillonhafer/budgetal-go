import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PlusButton = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Ionicons
        name="ios-add-outline"
        size={32}
        color={'#037aff'}
        style={{
          fontWeight: '300',
          paddingRight: 20,
          paddingLeft: 20,
        }}
      />
    </TouchableOpacity>
  );
};

export default PlusButton;
