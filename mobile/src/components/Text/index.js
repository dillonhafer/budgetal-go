import React from 'react';
import { Text, StyleSheet } from 'react-native';

export const BudgetalText = props => {
  const { style, children, ...rest } = props;

  return (
    <Text style={[styles.regular, style]} {...rest}>
      {children}
    </Text>
  );
};
export const Medium = BudgetalText;

export const Small = props => {
  const { style, children, ...rest } = props;

  return (
    <Text style={[styles.small, style]} {...rest}>
      {children}
    </Text>
  );
};

export const Label = props => {
  const { style, children, ...rest } = props;

  return (
    <Text style={[styles.label, style]} {...rest}>
      {children}
    </Text>
  );
};

export const Bold = props => {
  const { style, children, ...rest } = props;

  return (
    <Text style={[styles.bold, style]} {...rest}>
      {children}
    </Text>
  );
};

export const HeaderText = props => {
  const { style, children, ...rest } = props;

  return (
    <Text style={[styles.header, style]} {...rest}>
      {children}
    </Text>
  );
};

export const ButtonText = props => {
  const { style, children, ...rest } = props;

  return (
    <Text style={[styles.button, style]} {...rest}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 12,
    fontFamily: 'Montserrat-Bold',
  },
  small: {
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
  },
  regular: {
    fontFamily: 'Montserrat-Medium',
  },
  bold: {
    fontFamily: 'Montserrat-Bold',
  },
  header: {
    fontSize: 16,
    color: 'rgba(0,0,0,0.9)',
    textAlign: 'center',
    fontFamily: 'Montserrat-Medium',
  },
  backStyle: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 16,
  },
  button: {
    fontFamily: 'Montserrat-Bold',
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '900',
  },
});

export const headerBackTitleStyle = styles.backStyle;
