import React, { PureComponent } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  StatusBar,
  View,
  SectionList,
  Alert,
} from 'react-native';

// Redux
import { connect } from 'react-redux';
import { removeExpense } from 'actions/budget-item-expenses';

// API
import { DeleteExpenseRequest } from 'api/budget-item-expenses';

// Components
import { groupBy, orderBy, transform } from 'lodash';
import {
  Ionicons,
  FontAwesome,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import { currencyf } from 'utils/helpers';
import { notice, confirm, error } from 'notify';
import moment from 'moment';
import colors from 'utils/colors';
import PlusButton from 'utils/PlusButton';
import Swipeout from 'react-native-swipeout';

class BudgetItemScreen extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    const budgetItem = params.budgetItem;
    const onPress = () => {
      navigation.navigate('NewBudgetItemExpense', {
        budgetItem,
      });
    };
    return {
      headerRight: <PlusButton onPress={onPress} />,
    };
  };

  deleteExpense = async expense => {
    const resp = await DeleteExpenseRequest(expense.id);
    if (resp && resp.ok) {
      this.props.removeExpense(expense);
      notice(`${expense.name} Deleted`);
    }
  };

  confirmDelete = expense => {
    const okOk = () => {};

    confirm({
      title: `Delete ${expense.name}?`,
      okText: 'Delete',
      onOk: () => {
        this.deleteExpense(expense);
      },
    });
  };

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

  expenseButtons = expense => {
    return [
      {
        component: (
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <MaterialCommunityIcons name="pencil" color={'#fff'} size={20} />
          </View>
        ),
        backgroundColor: colors.primary,
        underlayColor: colors.primary + '70',
        onPress: () =>
          this.props.navigation.navigate('EditBudgetItemExpense', {
            budgetItemExpense: expense,
          }),
      },
      {
        component: (
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <MaterialCommunityIcons name="delete" color={'#fff'} size={20} />
          </View>
        ),
        backgroundColor: colors.error,
        underlayColor: colors.error + '70',
        onPress: () => this.confirmDelete(expense),
      },
    ];
  };

  renderExpense = ({ item: expense }) => {
    const buttons = this.expenseButtons(expense);
    return (
      <Swipeout
        buttonWidth={84}
        autoClose={true}
        backgroundColor={colors.primary}
        right={buttons}
      >
        <View style={styles.expenseRow} key={expense.id}>
          <Text style={{ width: '70%', textAlign: 'center' }}>
            {expense.name}
          </Text>
          <Text style={styles.amount}>{currencyf(expense.amount)}</Text>
        </View>
      </Swipeout>
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
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  amount: {
    width: '30%',
    color: colors.error,
    textAlign: 'center',
    fontWeight: '800',
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
  dispatch => ({
    removeExpense: expense => {
      dispatch(removeExpense(expense));
    },
  }),
)(BudgetItemScreen);
