import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import colors from 'utils/colors';
export {
  default as NavigationInputAccessoryView,
} from './NavigationInputAccessoryView';

export const PrimarySquareButton = ({ title, onPress, loading }) => {
  return (
    <Button
      color={colors.primary}
      backgroundColor={colors.primary}
      title={title}
      titleColor={'#fff'}
      onPress={onPress}
      loading={loading}
      borderRadius={3}
    />
  );
};

export const PrimaryButton = ({ title, onPress, loading }) => {
  return (
    <Button
      color={colors.primary}
      backgroundColor={colors.primary}
      title={title}
      titleColor={'#fff'}
      onPress={onPress}
      loading={loading}
    />
  );
};

export const DangerButton = ({ title, onPress, loading }) => {
  return (
    <Button
      color={colors.error}
      backgroundColor={'#fff'}
      titleColor={colors.error}
      title={title}
      onPress={onPress}
      loading={loading}
    />
  );
};

const buttonHeight = 36;
export const Button = ({
  title,
  color,
  backgroundColor,
  titleColor,
  onPress,
  loading,
  borderRadius,
}) => {
  const styles = {
    margin: 10,
    marginHorizontal: 20,
    padding: 8,
    backgroundColor,
    borderWidth: 2,
    borderRadius: borderRadius || buttonHeight / 2,
    borderColor: color,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 3 },
    shadowColor: backgroundColor,
    shadowOpacity: 0.2,
  };
  return (
    <View style={{ alignSelf: 'stretch', opacity: loading ? 0.4 : 1 }}>
      <TouchableOpacity
        disabled={loading}
        style={styles}
        activeOpacity={0.4}
        onPress={onPress}
      >
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
              color: titleColor,
              fontSize: 13,
              fontWeight: '900',
            }}
          >
            {title.toUpperCase()}
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
