import React, { Component } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';

// Components
import moment from 'moment';
import colors from 'utils/colors';
import { currencyf } from 'utils/helpers';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { round, times } from 'lodash';

class AnnualBudgetItemProgress extends Component {
  renderItem = ({ item }) => {
    return (
      <View style={styles.row}>
        <View style={styles.dateRow}>
          <MaterialCommunityIcons
            name={item.icon}
            color={item.color}
            size={22}
            style={{ marginRight: 5 }}
          />
          <Text style={styles.date}>{item.date}</Text>
        </View>
        <Text style={styles.amount}>{currencyf(item.amount)}</Text>
      </View>
    );
  };

  renderSeparator = () => {
    return (
      <View style={styles.listSeparatorContainer}>
        <View style={styles.listSeparator} />
      </View>
    );
  };

  renderHeader = () => {
    const item = this.props.navigation.state.params.budgetItem;
    return (
      <View style={{ padding: 10, alignItems: 'center' }}>
        <Text style={styles.headerText}>Accumulation Progress for</Text>
        <Text style={styles.headerText}>{item.name}</Text>
      </View>
    );
  };

  render() {
    const item = this.props.navigation.state.params.budgetItem;
    const startDate = moment(item.dueDate).subtract(
      item.interval + 1,
      'months',
    );
    const monthlyAmount = round(item.amount / item.interval);
    const data = times(item.interval, key => {
      const date = startDate.add(1, 'months').format('LL');
      const success = moment().diff(startDate) > 0;
      const icon = success ? 'check-circle' : 'close-circle';
      const color = success ? colors.success : colors.error;
      const amount = monthlyAmount * (key + 1);

      return {
        key,
        date,
        icon,
        color,
        amount,
      };
    });

    return (
      <View style={styles.container}>
        <FlatList
          style={styles.list}
          data={data}
          renderItem={this.renderItem}
          ItemSeparatorComponent={this.renderSeparator}
          ListHeaderComponent={this.renderHeader}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    flexDirection: 'column',
  },
  list: { width: '100%' },
  listSeparatorContainer: {
    backgroundColor: '#fff',
  },
  listSeparator: {
    height: 1,
    width: '100%',
    backgroundColor: colors.lines,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  date: {
    fontSize: 18,
    fontWeight: '500',
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
  },
  row: {
    padding: 10,
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: {
    color: '#444',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default AnnualBudgetItemProgress;
