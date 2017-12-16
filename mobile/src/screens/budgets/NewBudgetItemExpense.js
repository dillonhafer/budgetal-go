import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  StatusBar,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

// Redux
import { connect } from 'react-redux';
import { createdExpense } from 'actions/budget-item-expenses';

// API
import { CreateExpenseRequest } from 'api/budget-item-expenses';

// Helpers
import { error, notice } from 'notify';

// Components
import {
  PrimaryButton,
  DangerButton,
  FieldContainer,
  CustomFieldContainer,
} from 'forms';
import MoneyInput from 'forms/MoneyInput';
import DateInput from 'forms/DateInput';

import { SetCurrentUser } from 'utils/authentication';
import { ImagePicker, BlurView } from 'expo';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import moment from 'moment';

class NewBudgetItemExpenseScreen extends Component {
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
    const { budgetItem } = this.props.navigation.state.params;
    this.setState({ budgetItem });
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

  createExpense = async () => {
    const { name, amount, date, budgetItem } = this.state;

    try {
      const resp = await CreateExpenseRequest({
        name,
        amount,
        date: date.format('YYYY-MM-DD'),
        budgetItemId: budgetItem.id,
      });

      if (resp && resp.ok) {
        this.props.createdExpense(resp.budgetItemExpense);
        this.goBack();
        notice('Expense saved');
      }
    } catch (err) {
      console.log(err);
      error('Something went wrong');
    }
  };

  handleOnPress = async () => {
    this.setState({ loading: true });
    try {
      if (this.validateFields()) {
        await this.createExpense();
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
    const { name, amount, date, loading, showMoneyKeyboard } = this.state;
    const valid = this.validateFields();

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <StatusBar barStyle="dark-content" />
        <FieldContainer>
          <TextInput
            style={{ height: 50 }}
            placeholder="Name"
            defaultValue={name}
            returnKeyType="next"
            onChangeText={name => this.setState({ name })}
          />
        </FieldContainer>
        <FieldContainer>
          <MoneyInput
            title="Expense Amount"
            displayAmount={amount}
            onChange={amount => this.setState({ amount })}
          />
        </FieldContainer>
        <CustomFieldContainer>
          <DateInput onChange={date => this.setState({ date })} />
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
    backgroundColor: '#ececec',
    alignItems: 'center',
    flexDirection: 'column',
    paddingBottom: 40,
  },
});

export default connect(
  state => ({}),
  dispatch => ({
    createdExpense: expense => {
      dispatch(createdExpense(expense));
    },
  }),
)(NewBudgetItemExpenseScreen);
