import React, { PureComponent } from 'react';
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
import { removeExpense } from 'actions/budget-item-expenses';

// API
import { DeleteExpenseRequest } from 'api/budget-item-expenses';

// Helpers
import { BlurViewInsetProps } from 'utils/navigation-helpers';

// Components
import { groupBy, orderBy, transform } from 'lodash';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { currencyf, reduceSum } from 'utils/helpers';
import { notice, confirm } from 'notify';
import moment from 'moment';
import colors from 'utils/colors';
import PlusButton from 'utils/PlusButton';
import MoneyAnimation from 'components/MoneyAnimation';
import Card from 'components/Card';

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

  state = {
    visibleExpenseId: null,
  };

  deleteExpense = async expense => {
    const resp = await DeleteExpenseRequest(expense.id);
    if (resp && resp.ok) {
      this.props.removeExpense(expense);
      notice(`${expense.name} Deleted`);
    }
  };

  confirmDelete = expense => {
    confirm({
      title: `Delete ${expense.name}?`,
      okText: 'Delete',
      onOk: () => {
        this.deleteExpense(expense);
      },
    });
  };

  toggleVisibleExpense = id => {
    this.setState({
      visibleExpenseId: id === this.state.visibleExpenseId ? null : id,
    });
  };

  renderExpense = ({ item: expense }) => {
    const borderRadiusStyles = {
      first: styles.firstRow,
      last: styles.lastRow,
      only: styles.onlyRow,
    }[expense.position];
    const visible = this.state.visibleExpenseId === expense.id;

    return (
      <View style={[styles.expenseRowContainer, borderRadiusStyles]}>
        <View style={styles.expenseRow} key={expense.id}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() => {
                this.toggleVisibleExpense(expense.id);
              }}
            >
              <MaterialCommunityIcons
                name="dots-horizontal-circle"
                size={22}
                color={'#aaa'}
                style={styles.expenseOptionsIcon}
              />
            </TouchableOpacity>
            <Text style={styles.expenseText}>{expense.name}</Text>
          </View>
          <Text style={styles.amount}>{currencyf(expense.amount)}</Text>
        </View>
        {visible && (
          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('EditBudgetItemExpense', {
                  budgetItemExpense: expense,
                })
              }
              style={{
                flex: 1,
              }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <MaterialCommunityIcons
                  name="pencil"
                  color={colors.primary}
                  size={20}
                  style={{ marginRight: 5 }}
                />
                <Text style={{ color: colors.primary }}>EDIT</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.confirmDelete(expense)}
              style={{
                flex: 1,
              }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <MaterialCommunityIcons
                  name="delete"
                  color={colors.error}
                  size={20}
                  style={{ marginRight: 5 }}
                />
                <Text style={{ color: colors.error }}>DELETE</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  renderSectionHeader = ({ section }) => {
    return (
      <View style={styles.header}>
        <Text style={styles.headerText}>
          {moment(section.title, 'YYYY-MM-DD')
            .format('MMMM DD')
            .toUpperCase()}
        </Text>
      </View>
    );
  };

  renderHeader = length => {
    if (length > 0) {
      const { budgetItem } = this.props.navigation.state.params;

      const expenses = this.props.budgetItemExpenses.filter(e => {
        return budgetItem.id === e.budgetItemId;
      });

      const amountSpent = reduceSum(expenses);
      const amountBudgeted = budgetItem.amount;
      const remaining = amountBudgeted - amountSpent;

      return (
        <View>
          <View
            style={{
              height: 100,
              backgroundColor: '#fff',
              zIndex: 0,
            }}
          />
          <View style={{ zIndex: 1, backgroundColor: '#d8dce0' }}>
            <View style={{ marginTop: -90 }}>
              <Card
                label={budgetItem.name}
                budgeted={amountBudgeted}
                spent={amountSpent}
                remaining={remaining}
              />
            </View>
          </View>
        </View>
      );
    }
    return (
      <View style={{ padding: 20, paddingTop: 40, alignItems: 'center' }}>
        <MoneyAnimation />
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
    const sections = transform(
      groupBy(orderBy(expenses, ['date', 'id'], ['desc', 'desc']), 'date'),
      (result, value, key) => {
        result.push({ data: value, title: key });
      },
      [],
    );

    const expenseSections = sections.map(sec => {
      return {
        ...sec,
        data: sec.data.map((ex, i) => {
          let position = '';
          if (i === 0) {
            position = 'first';
          }
          if (i === sec.data.length - 1) {
            position = 'last';
          }

          if (sec.data.length === 1) {
            position = 'only';
          }

          return { ...ex, position };
        }),
      };
    });

    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View
          style={[
            StyleSheet.absoluteFill,
            { top: 300, backgroundColor: '#d8dce0' },
          ]}
        />
        <SectionList
          {...BlurViewInsetProps}
          ListHeaderComponent={() => {
            return this.renderHeader(expenseSections.length);
          }}
          style={styles.list}
          contentContainerStyle={styles.contentStyles}
          stickySectionHeadersEnabled={false}
          keyExtractor={i => i.id}
          sections={expenseSections}
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
    // backgroundColor: '#d8dce0',
    backgroundColor: '#fff',
    alignItems: 'center',
    flexDirection: 'column',
  },
  list: {
    alignSelf: 'stretch',
  },
  contentStyles: {
    backgroundColor: '#d8dce0',
    minHeight: '100%',
  },
  expenseRowContainer: {
    flex: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowColor: '#aaa',
    shadowOpacity: 0.3,
    backgroundColor: '#fff',
    marginHorizontal: 20,
    padding: 10,
    paddingVertical: 15,
  },
  expenseRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  firstRow: {
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  lastRow: {
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },
  onlyRow: {
    borderRadius: 3,
  },
  expenseOptionsIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 24,
    width: 24,
    marginRight: 5,
  },
  expenseText: {
    fontWeight: 'bold',
  },
  amount: {
    color: colors.error,
    fontWeight: '800',
    fontSize: 16,
  },
  header: {
    margin: 20,
    marginBottom: 5,
    backgroundColor: 'transparent',
    padding: 5,
  },
  headerText: {
    color: '#555',
    fontWeight: 'bold',
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
