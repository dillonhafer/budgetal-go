import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import colors from 'utils/colors';

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

export const FieldContainer = props => {
  return (
    <View
      style={{
        height: 50,
        backgroundColor: '#fff',
        borderBottomColor: '#aaa',
        borderWidth: 0.5,
        paddingLeft: 20,
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
