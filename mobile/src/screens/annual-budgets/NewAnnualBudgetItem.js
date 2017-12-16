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
import { itemAdded } from 'actions/annual-budget-items';

// API
import { CreateAnnualBudgetItemRequest } from 'api/annual-budget-items';

// Helpers
import { error, notice } from 'notify';
import { range } from 'lodash';

// Components
import {
  PrimaryButton,
  DangerButton,
  FieldContainer,
  CustomFieldContainer,
} from 'forms';
import MoneyInput from 'forms/MoneyInput';
import DateInput from 'forms/DateInput';
import SelectInput from 'forms/SelectInput';
import SwitchInput from 'forms/SwitchInput';
import moment from 'moment';

class NewAnnualBudgetItemScreen extends Component {
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
    interval: 12,
    paid: false,
  };

  componentDidMount() {
    const { annualBudgetId } = this.props.navigation.state.params;
    this.setState({ annualBudgetId });
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

  createItem = async () => {
    const { name, amount, date, interval, paid, annualBudgetId } = this.state;

    try {
      const resp = await CreateAnnualBudgetItemRequest({
        annualBudgetId,
        name,
        amount,
        dueDate: date.format('YYYY-MM-DD'),
        interval,
        paid,
      });

      if (resp && resp.ok) {
        this.props.itemAdded(resp.annualBudgetItem);
        this.goBack();
        notice('Item saved');
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
        await this.createItem();
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
        <FieldContainer position="first">
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
            title="Amount"
            displayAmount={amount}
            defaultValue={(amount * 100).toFixed()}
            onChange={amount => this.setState({ amount })}
          />
        </FieldContainer>
        <CustomFieldContainer>
          <DateInput onChange={date => this.setState({ date })} />
        </CustomFieldContainer>

        <CustomFieldContainer>
          <SelectInput
            placeholder="Interval"
            onChange={interval =>
              this.setState({ interval: parseInt(interval, 10) })}
            data={range(1, 13).map(n => {
              return { label: String(n), value: String(n) };
            })}
          />
        </CustomFieldContainer>

        <CustomFieldContainer>
          <SwitchInput
            label="Paid"
            onChange={paid => this.setState({ paid })}
          />
        </CustomFieldContainer>

        <View style={{ height: 10 }} />

        <PrimaryButton
          title="Save Item"
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
    itemAdded: item => {
      dispatch(itemAdded(item));
    },
  }),
)(NewAnnualBudgetItemScreen);
