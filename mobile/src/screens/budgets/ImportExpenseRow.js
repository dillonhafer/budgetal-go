import React, { PureComponent } from 'react';
import {
  ActivityIndicator,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Picker,
} from 'react-native';

// Redux
import { connect } from 'react-redux';
import { createdExpense } from 'actions/budget-item-expenses';

// API
import { CreateExpenseRequest } from 'api/budget-item-expenses';

// Helpers
import colors from 'utils/colors';
import { Ionicons } from '@expo/vector-icons';
import { notice } from 'notify';
import { currencyf } from 'utils/helpers';

const findFirstItemId = (categoryId, items) => {
  return (items.find(i => i.budgetCategoryId === categoryId) || { id: 0 }).id;
};

class ImportExpenseRow extends PureComponent {
  constructor(props) {
    super(props);
    const { defaultBudgetItem } = this.props;
    this.state = {
      loading: false,
      budgetCategoryId: defaultBudgetItem.budgetCategoryId,
      budgetItemId: defaultBudgetItem.id,
    };
  }

  onSkip = () => {
    this.props.onNext(this.props.index);
  };

  onSave = () => {
    const { index, total } = this.props;
    const lastExpense = index + 1 === total;
    if (lastExpense) {
      this.props.onDone();
      notice('Import Finished');
    } else {
      this.saveExpense();
    }
  };

  saveExpense = async () => {
    this.setState({ loading: true });
    try {
      const resp = await CreateExpenseRequest({
        name: this.props.item.description,
        amount: this.props.item.amount,
        date: this.props.item.date.format('YYYY-MM-DD'),
        budgetItemId: this.state.budgetItemId,
      });
      if (resp && resp.ok) {
        this.props.createdExpense(resp.budgetItemExpense);
        this.onSkip();
      } else {
        // show errors
      }
    } catch (err) {
      // show errors
    } finally {
      this.setState({ loading: false });
    }
  };

  valid = () => {
    return this.state.budgetItemId > 0;
  };

  isPossible = () => {
    const { item, budgetItemExpenses } = this.props;
    return budgetItemExpenses.find(e => {
      return (
        e.name === item.description &&
        e.amount === item.amount &&
        e.date === item.date.format('YYYY-MM-DD')
      );
    });
  };

  render() {
    const { item, index, width, total } = this.props;
    const { loading } = this.state;
    const saveDisabled = loading || !this.valid();
    const lastExpense = loading || index + 1 === total;
    const isPossible = this.isPossible();

    return (
      <View
        style={{
          width,
          alignItems: 'center',
        }}
      >
        <Text style={styles.breadcrumb}>
          {index + 1} of {total} Expenses
        </Text>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center',
            flex: 1,
          }}
        >
          <View style={styles.picker}>
            <Picker
              style={{ width: '50%' }}
              selectedValue={String(this.state.budgetCategoryId)}
              onValueChange={itemValue => {
                const budgetCategoryId = parseInt(itemValue, 10);
                const budgetItemId = findFirstItemId(
                  budgetCategoryId,
                  this.props.budgetItems,
                );

                this.setState({
                  budgetCategoryId,
                  budgetItemId,
                });
              }}
            >
              {this.props.budgetCategories.map(c => {
                return (
                  <Picker.Item
                    key={c.id}
                    label={String(c.name)}
                    value={String(c.id)}
                  />
                );
              })}
            </Picker>
            <Picker
              style={{ width: '50%' }}
              selectedValue={String(this.state.budgetItemId)}
              onValueChange={itemValue =>
                this.setState({ budgetItemId: parseInt(itemValue, 10) || 0 })
              }
            >
              {this.props.budgetItems
                .filter(i => {
                  return i.budgetCategoryId === this.state.budgetCategoryId;
                })
                .map(i => {
                  return (
                    <Picker.Item
                      key={i.id}
                      label={String(i.name)}
                      value={String(i.id)}
                    />
                  );
                })}
            </Picker>
          </View>
        </View>
        <View style={{ flex: 1, padding: 10 }}>
          <Text style={styles.date}>
            {item.date.format('dddd, MMM Do YYYY')}
          </Text>
          <Text
            numberOfLines={2}
            adjustFontSizeToFit={true}
            style={styles.description}
          >
            {item.description}
          </Text>
          <Text style={styles.amount}>{currencyf(item.amount)}</Text>
        </View>
        <View
          style={{
            width: '100%',
            marginTop: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <TouchableOpacity onPress={this.onSkip} disabled={lastExpense}>
            <Ionicons
              name="ios-close-circle-outline"
              size={48}
              color={colors.error}
              style={{
                fontWeight: '300',
                paddingRight: 20,
                paddingLeft: 20,
                opacity: lastExpense ? 0.4 : 1,
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={this.onSave} disabled={saveDisabled}>
            {loading && (
              <View
                style={{
                  paddingRight: 20,
                  paddingLeft: 20,
                }}
              >
                <ActivityIndicator size="large" color={colors.primary} />
              </View>
            )}
            {!loading && (
              <Ionicons
                name="ios-checkmark-circle-outline"
                size={48}
                color={colors.primary}
                style={{
                  fontWeight: '300',
                  paddingRight: 20,
                  paddingLeft: 20,
                  opacity: saveDisabled ? 0.4 : 1,
                }}
              />
            )}
          </TouchableOpacity>
        </View>
        {isPossible && (
          <View style={styles.tag}>
            <Ionicons name="ios-alert" style={styles.tagIcon} />
            <Text style={styles.tagText}>Possible Duplicate</Text>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  breadcrumb: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 10,
  },
  picker: {
    width: '100%',
    borderColor: colors.lines,
    borderRightColor: 'transparent',
    borderLeftColor: 'transparent',
    borderWidth: 0.5,
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  description: {
    textAlign: 'center',
    color: '#AAA',
    fontSize: 16,
  },
  amount: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
  },
  date: {
    textAlign: 'center',
    fontSize: 18,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    borderRadius: 5,
    backgroundColor: colors.yellow,
  },
  tagText: {
    textAlign: 'center',
    color: '#fff',
    paddingRight: 5,
  },
  tagIcon: {
    marginHorizontal: 5,
    color: '#fff',
    fontSize: 22,
  },
});

export default connect(
  state => ({
    ...state.budget,
  }),
  dispatch => ({
    createdExpense: expense => {
      dispatch(createdExpense(expense));
    },
  }),
)(ImportExpenseRow);
