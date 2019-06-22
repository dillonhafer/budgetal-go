import React from 'react';
import { View } from 'react-native';

const FieldContainer = props => {
  return (
    <View
      style={{
        height: 50,
        backgroundColor: '#fff',
        borderBottomColor: '#aaa',
        borderWidth: 0.5,
        paddingLeft: 20,
        borderTopColor: props.position === 'first' ? '#aaa' : '#fff',
        borderRightColor: '#fff',
        borderLeftColor: '#fff',
        alignSelf: 'stretch',
        flexDirection: props.children.length > 1 ? 'row' : 'column',
        alignItems: props.children.length > 1 ? 'center' : null,
      }}
    >
      {props.children}
    </View>
  );
};

export default FieldContainer;
