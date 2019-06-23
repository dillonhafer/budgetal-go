import React, { PureComponent } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';

// Components
import { BlurViewInsetProps } from '@src/utils/navigation-helpers';
import moment from 'moment';
import { colors } from '@shared/theme';
import { currencyf } from '@shared/helpers';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { round, times } from 'lodash';
import { Bold, Medium } from '@src/components/Text';
import Device from '@src/utils/Device';
const isTablet = Device.isTablet();

class AnnualBudgetItemProgress extends PureComponent {
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
          <Medium style={styles.date}>{item.date}</Medium>
        </View>
        <Bold style={styles.amount}>{currencyf(item.amount)}</Bold>
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
        <Bold style={styles.headerText}>Accumulation Progress for</Bold>
        <Bold style={styles.headerText}>{item.name}</Bold>
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
        key: String(key),
        date,
        icon,
        color,
        amount,
      };
    });

    return (
      <View style={styles.container}>
        <FlatList
          {...BlurViewInsetProps}
          style={styles.list}
          contentContainerStyle={styles.listContainer}
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
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: isTablet ? 'transparent' : '#fff',
  },
  list: {
    width: '100%',
  },
  listContainer: {
    backgroundColor: '#fff',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 5,
    margin: isTablet ? 20 : 0,
  },
  listSeparatorContainer: {
    backgroundColor: '#fff',
  },
  listSeparator: {
    height: 1,
    flex: 1,
    marginHorizontal: 15,
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
    marginHorizontal: 15,
    paddingVertical: 15,
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
