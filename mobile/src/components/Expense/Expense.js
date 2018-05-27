import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Helpers
import { currencyf } from 'utils/helpers';
import colors from 'utils/colors';
import { notice, confirm } from 'notify';

// API
import { DeleteExpenseRequest } from 'api/budget-item-expenses';

class Expense extends PureComponent {
  deleteExpense = async () => {
    const { expense, removeExpense } = this.props;
    const resp = await DeleteExpenseRequest(expense.id);
    if (resp && resp.ok) {
      removeExpense(expense);
      notice(`${expense.name} Deleted`);
    }
  };

  confirmDelete = () => {
    confirm({
      title: `Delete ${this.props.expense.name}?`,
      okText: 'Delete',
      onOk: this.deleteExpense,
    });
  };

  edit = () => {
    this.props.navigation.navigate('EditBudgetItemExpense', {
      budgetItemExpense: this.props.expense,
    });
  };

  toggleActive = () => {
    this.props.toggleVisibleExpense(this.props.expense.id);
  };

  render() {
    const { expense, active } = this.props;
    const borderRadiusStyles = {
      first: styles.firstRow,
      last: styles.lastRow,
      only: styles.onlyRow,
    }[expense.position];

    return (
      <View style={[styles.expenseRowContainer, borderRadiusStyles]}>
        <View style={styles.expenseRow}>
          <View style={styles.nameRow}>
            <TouchableOpacity onPress={this.toggleActive}>
              <MaterialCommunityIcons
                name="dots-horizontal-circle"
                size={22}
                style={styles.expenseOptionsIcon}
              />
            </TouchableOpacity>
            <Text style={styles.expenseText}>{expense.name}</Text>
          </View>
          <Text style={styles.amount}>{currencyf(expense.amount)}</Text>
        </View>
        {active && (
          <View style={styles.crudRow}>
            <TouchableOpacity
              onPress={this.edit}
              style={{
                flex: 1,
              }}
            >
              <View style={styles.buttonRow}>
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
              onPress={this.confirmDelete}
              style={{
                flex: 1,
              }}
            >
              <View style={styles.buttonRow}>
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
  }
}

const styles = StyleSheet.create({
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
    color: '#aaa',
  },
  expenseText: {
    fontWeight: 'bold',
  },
  amount: {
    color: colors.error,
    fontWeight: '800',
    fontSize: 16,
  },
  crudRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Expense;
