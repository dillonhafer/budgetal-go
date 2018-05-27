import React, { PureComponent } from 'react';
import colors from 'utils/colors';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { currencyf } from 'utils/helpers';

class Card extends PureComponent {
  render() {
    const { label, budgeted, spent, remaining } = this.props;

    return (
      <View style={styles.container}>
        <Text style={styles.headerText}>{label}</Text>
        <Text style={styles.headerValueText}>{currencyf(budgeted)}</Text>
        <View style={styles.secondaryRow}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row' }}>
              <View>
                <Ionicons
                  name="ios-remove-circle"
                  style={{ marginRight: 8 }}
                  color={'#ffffffA0'}
                  size={32}
                />
              </View>
              <View>
                <Text style={styles.secondaryLabel}>Spent</Text>
                <Text style={styles.secondaryValue}>{currencyf(spent)}</Text>
              </View>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row' }}>
              <View>
                <Ionicons
                  name="ios-add-circle"
                  style={{ marginRight: 8 }}
                  color={'#ffffffA0'}
                  size={32}
                />
              </View>
              <View>
                <Text style={styles.secondaryLabel}>Remaining</Text>
                <Text style={styles.secondaryValue}>
                  {currencyf(remaining)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    borderRadius: 6,
    padding: 20,
    margin: 10,
  },
  headerText: {
    color: '#fff',
    marginBottom: 10,
    fontSize: 15,
  },
  headerValueText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 29,
  },
  secondaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
  },
  secondaryLabel: {
    color: '#fff',
    fontSize: 10,
  },
  secondaryValue: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default Card;
