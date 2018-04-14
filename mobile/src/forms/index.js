import React from 'react';
import {
  Keyboard,
  // InputAccessoryView,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';
import colors from 'utils/colors';

const InputAccessoryView = () => null;
export const PrimaryButton = ({ title, onPress, loading }) => {
  return (
    <Button
      color={colors.primary}
      title={title}
      onPress={onPress}
      loading={loading}
    />
  );
};

export const DangerButton = ({ title, onPress, loading }) => {
  return (
    <Button
      color={colors.error}
      title={title}
      onPress={onPress}
      loading={loading}
    />
  );
};

export const Button = ({ title, color, onPress, loading }) => {
  const styles = {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: '#aaa',
    borderLeftColor: 'white',
    borderRightColor: 'white',
  };
  return (
    <View style={{ alignSelf: 'stretch', opacity: loading ? 0.4 : 1 }}>
      <TouchableOpacity disabled={loading} style={styles} onPress={onPress}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              textAlign: 'center',
              color: color,
              fontSize: 18,
            }}
          >
            {title}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
export const inputAccessoryViewID = 'AccessoryDoneID';
export const FieldContainer = props => {
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
      <InputAccessoryView nativeID={inputAccessoryViewID}>
        <Button onPress={Keyboard.dismiss} title="Done" />
      </InputAccessoryView>
    </View>
  );
};

export const CustomFieldContainer = props => {
  return (
    <View
      style={{
        backgroundColor: '#fff',
        borderBottomColor: '#aaa',
        borderWidth: 0.5,
        borderTopColor: '#fff',
        borderRightColor: '#fff',
        borderLeftColor: '#fff',
        alignSelf: 'stretch',
      }}
    >
      {props.children}
    </View>
  );
};
