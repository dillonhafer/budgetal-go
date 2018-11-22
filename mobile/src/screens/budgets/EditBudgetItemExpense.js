import React, { Component } from 'react';
import {
  StyleSheet,
  TextInput,
  StatusBar,
  View,
  ScrollView,
} from 'react-native';

// Redux
import { connect } from 'react-redux';
import { updateExpense } from 'actions/budget-item-expenses';

// API
import { UpdateExpenseRequest } from '@shared/api/budget-item-expenses';

// Helpers
import { BlurViewInsetProps } from 'utils/navigation-helpers';
import { error, notice } from 'notify';
import moment from 'moment';

// Components
import {
  PrimaryButton,
  DangerButton,
  FieldContainer,
  CustomFieldContainer,
} from 'forms';
import MoneyInput from 'forms/MoneyInput';
import DateInput from 'forms/DateInput';

class EditBudgetItemExpenseScreen extends Component {
  goBack = () => {
    this.props.navigation.goBack();
  };

  inputs = [];

  state = {
    loading: false,
    showMoneyKeyboard: false,
    name: '',
    amount: 0.0,
    date: moment(),
  };

  componentDidMount() {
    const { budgetItemExpense } = this.props.navigation.state.params;
    this.setState({
      id: budgetItemExpense.id,
      name: budgetItemExpense.name,
      amount: budgetItemExpense.amount,
      date: moment(budgetItemExpense.date, 'YYYY-MM-DD'),
    });
  }

  validateFields = () => {
    const { name, amount, date } = this.state;
    return name.length > 0 && amount > 0 && date.isValid();
  };

  showMoneyKeyboard = () => {
    StatusBar.setBarStyle('light-content', true);
    this.setState({ showMoneyKeyboard: true });
  };

  hideMoneyKeyboard = () => {
    StatusBar.setBarStyle('light-dark', true);
    this.setState({ showMoneyKeyboard: false });
  };

  updateExpense = async () => {
    const { id, name, amount, date } = this.state;

    try {
      const resp = await UpdateExpenseRequest({
        id,
        name,
        amount,
        date: date.format('YYYY-MM-DD'),
      });

      if (resp && resp.ok) {
        this.props.updateExpense(resp.budgetItemExpense);
        this.goBack();
        notice('Expense saved');
      }
    } catch (err) {
      error('Could not update expense');
    }
  };

  handleOnPress = async () => {
    this.setState({ loading: true });
    try {
      if (this.validateFields()) {
        await this.updateExpense();
      } else {
        error('Form is not valid');
      }
    } catch (err) {
      // console.log(err)
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const { name, amount, date, loading } = this.state;
    const valid = this.validateFields();

    return (
      <ScrollView
        contentContainerStyle={styles.container}
        {...BlurViewInsetProps}
      >
        <StatusBar barStyle="dark-content" />
        <FieldContainer position="first">
          <TextInput
            style={{ height: 50 }}
            placeholder="Name"
            defaultValue={name}
            returnKeyType="next"
            underlineColorAndroid={'transparent'}
            onChangeText={name => this.setState({ name })}
          />
        </FieldContainer>
        <FieldContainer>
          <MoneyInput
            title="Expense Amount"
            displayAmount={amount}
            defaultValue={(amount * 100).toFixed()}
            onChange={amount => this.setState({ amount })}
          />
        </FieldContainer>
        <CustomFieldContainer>
          <DateInput
            defaultValue={date}
            onChange={date => this.setState({ date })}
          />
        </CustomFieldContainer>

        <View style={{ height: 10 }} />

        <PrimaryButton
          title="Save Expense"
          onPress={this.handleOnPress}
          loading={!valid || loading}
        />

        <DangerButton title="Cancel" onPress={this.goBack} />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    flexDirection: 'column',
    paddingBottom: 40,
    paddingTop: 15,
  },
});

export default connect(null, dispatch => ({
  updateExpense: expense => {
    dispatch(updateExpense(expense));
  },
}))(EditBudgetItemExpenseScreen);
