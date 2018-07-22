import React, { PureComponent } from 'react';
import colors from 'utils/colors';
import { Image, View, Text, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { currencyf } from 'utils/helpers';

class Card extends PureComponent {
  render() {
    const {
      label,
      budgeted,
      spent,
      remaining,
      image,
      color,
      light,
      marginHorizontal = 20,
      decimal = 2,
      spentLabel = 'Spent',
      remainingLabel = 'Remaining',
    } = this.props;

    const themeStyles = light ? lightStyles : darkStyles;
    const backgroundColor = color || colors.primary;

    return (
      <View style={[styles.container, { marginHorizontal, backgroundColor }]}>
        <View style={{ flexDirection: 'row' }}>
          {image && (
            <View>
              <Image style={styles.image} source={image} />
            </View>
          )}
          <View style={{ flex: 1 }}>
            <Text style={themeStyles.headerText}>{label}</Text>
            <Text
              style={themeStyles.headerValueText}
              adjustsFontSizeToFit={true}
              numberOfLines={1}
            >
              {currencyf(budgeted, '$', decimal)}
            </Text>
          </View>
        </View>
        <View style={styles.secondaryRow}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row' }}>
              <View>
                <Ionicons
                  name="ios-remove-circle"
                  style={themeStyles.icon}
                  size={32}
                />
              </View>
              <View>
                <Text style={themeStyles.secondaryLabel}>{spentLabel}</Text>
                <Text
                  adjustsFontSizeToFit={true}
                  numberOfLines={1}
                  style={themeStyles.secondaryValue}
                >
                  {currencyf(spent, '$', decimal)}
                </Text>
              </View>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row' }}>
              <View>
                <Ionicons
                  name="ios-add-circle"
                  style={themeStyles.icon}
                  size={32}
                />
              </View>
              <View style={{ paddingRight: 25 }}>
                <Text style={themeStyles.secondaryLabel}>{remainingLabel}</Text>
                <Text
                  adjustsFontSizeToFit={true}
                  numberOfLines={1}
                  style={themeStyles.secondaryValue}
                >
                  {currencyf(remaining, undefined, decimal)}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={{ marginTop: this.props.children ? 10 : 0 }}>
          {this.props.children}
        </View>
      </View>
    );
  }
}

const borderRadius = 12;
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    borderRadius,
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 20,
    shadowOffset: { wdth: 0, height: 5 },
    shadowColor: '#aaa',
    shadowOpacity: 0.6,
    justifyContent: 'space-between',
  },
  secondaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
  },
  image: {
    width: 64,
    height: 64,
    marginRight: 10,
  },
});

const sharedStyles = {
  headerText: {
    color: '#fff',
    marginBottom: 10,
    fontSize: 17,
    fontWeight: 'bold',
  },
};

const darkTextColor = '#fff';
const darkStyles = StyleSheet.create({
  headerText: {
    color: '#fff',
    marginBottom: 10,
    fontSize: 17,
    fontWeight: 'bold',
  },
  headerValueText: {
    color: darkTextColor,
    fontWeight: 'bold',
    fontSize: 29,
  },
  secondaryLabel: {
    color: darkTextColor,
    fontSize: 10,
  },
  secondaryValue: {
    color: darkTextColor,
    fontWeight: 'bold',
  },
  icon: {
    marginRight: 8,
    color: '#ffffffa0',
  },
});

const lightTextColor = '#555';
const lightStyles = StyleSheet.create({
  headerText: {
    color: '#aaa',
    marginBottom: 10,
    fontSize: 17,
    fontWeight: 'bold',
  },
  headerValueText: {
    color: lightTextColor,
    fontWeight: 'bold',
    fontSize: 29,
  },
  secondaryLabel: {
    color: lightTextColor,
    fontSize: 10,
  },
  secondaryValue: {
    color: lightTextColor,
    fontWeight: 'bold',
  },
  icon: {
    marginRight: 8,
    color: '#bbbbbba0',
  },
});

export default Card;
