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

export const LightText = props => {
  const { style, children, ...rest } = props;

  return (
    <Text style={[styles.light, style]} {...rest}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  light: {
    fontWeight: '100',
    fontFamily: 'System',
  },
  label: {
    fontSize: 12,
    fontFamily: 'System',
  },
  small: {
    fontSize: 12,
    fontFamily: 'System',
  },
  regular: {
    fontFamily: 'System',
  },
  bold: {
    fontFamily: 'System',
    fontWeight: '700',
  },
  header: {
    fontSize: 16,
    color: 'rgba(0,0,0,0.9)',
    textAlign: 'center',
    fontFamily: 'Lato-Medium',
  },
  backStyle: {
    fontFamily: 'System',
    fontSize: 16,
  },
  button: {
    fontFamily: 'System',
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '900',
  },
});

export const headerBackTitleStyle = styles.backStyle;
