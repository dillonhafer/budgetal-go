import React, { Component } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  StatusBar,
  View,
  SectionList,
} from 'react-native';

// Redux
import { connect } from 'react-redux';

// Components
import { groupBy, orderBy, transform } from 'lodash';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { currencyf } from 'utils/helpers';
import moment from 'moment';
import colors from 'utils/colors';

class BudgetItemScreen extends Component {
  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: '#CED0CE',
        }}
      />
    );
  };

  renderExpense = ({ item: expense }) => {
    return (
      <TouchableOpacity
        style={styles.expenseRow}
        key={expense.id}
        onPress={() => {}}
      >
        <Text style={{ width: '70%', padding: 10, textAlign: 'center' }}>
          {expense.name}
        </Text>
        <Text style={styles.amount}>{currencyf(expense.amount)}</Text>
      </TouchableOpacity>
    );
  };

  renderSectionHeader = ({ section }) => {
    return (
      <View style={styles.header}>
        <Text style={styles.headerText}>
          {moment(section.title, 'YYYY-MM-DD').format('MMMM DD')}
        </Text>
      </View>
    );
  };

  renderHeader = length => {
    if (!!length) {
      return null;
    }
    return (
      <View style={{ padding: 20, paddingTop: 40, alignItems: 'center' }}>
        <FontAwesome name="money" size={32} color={colors.success} />
        <Text style={{ margin: 5, textAlign: 'center', fontWeight: 'bold' }}>
          There aren't any expenses yet
        </Text>
      </View>
    );
  };

  render() {
    const item = this.props.navigation.state.params.budgetItem;
    const expenses = this.props.budgetItemExpenses.filter(
      i => i.budgetItemId === item.id,
    );
    const expenseSections = transform(
      groupBy(orderBy(expenses, ['date', 'id'], ['desc', 'desc']), 'date'),
      (result, value, key) => {
        result.push({ data: value, title: key });
      },
      [],
    );

    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <SectionList
          ListHeaderComponent={() => {
            return this.renderHeader(expenseSections.length);
          }}
          style={styles.list}
          keyExtractor={i => i.id}
          sections={expenseSections}
          ItemSeparatorComponent={this.renderSeparator}
          renderSectionHeader={this.renderSectionHeader}
          renderItem={this.renderExpense}
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
  list: {
    alignSelf: 'stretch',
  },
  expenseRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  amount: {
    width: '30%',
    padding: 10,
    color: colors.error,
    textAlign: 'center',
    fontWeight: '700',
  },
  header: {
    borderWidth: 0.5,
    borderColor: '#AAA',
    backgroundColor: '#f7f7f7',
    borderLeftColor: '#f7f7f7',
    borderRightColor: '#f7f7f7',
    padding: 5,
  },
  headerText: {
    color: '#AAA',
  },
});

export default connect(
  state => ({
    ...state.budget,
  }),
  dispatch => ({}),
)(BudgetItemScreen);
