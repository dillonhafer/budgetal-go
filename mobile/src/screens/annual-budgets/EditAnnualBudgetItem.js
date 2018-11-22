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
import { itemUpdated } from 'actions/annual-budget-items';

// API
import { UpdateAnnualBudgetItemRequest } from '@shared/api/annual-budget-items';

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
import { BlurViewInsetProps } from 'utils/navigation-helpers';

class EditAnnualBudgetItemScreen extends Component {
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
    const { annualBudgetItem } = this.props.navigation.state.params;
    this.setState({
      id: annualBudgetItem.id,
      name: annualBudgetItem.name,
      amount: annualBudgetItem.amount,
      date: moment(annualBudgetItem.dueDate, 'YYYY-MM-DD'),
      interval: annualBudgetItem.interval,
      paid: annualBudgetItem.paid,
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

  updateItem = async () => {
    const { id, name, amount, date, interval, paid } = this.state;

    try {
      const resp = await UpdateAnnualBudgetItemRequest({
        id,
        name,
        amount,
        dueDate: date.format('YYYY-MM-DD'),
        interval,
        paid,
      });

      let goBack = false;
      if (resp && resp.ok) {
        this.props.itemUpdated(resp.annualBudgetItem);
        notice('Item saved');
        goBack = true;
      }
      return goBack;
    } catch (err) {
      error('Could not update item');
    }
  };

  handleOnPress = async () => {
    this.setState({ loading: true });
    let goBack = false;
    try {
      if (this.validateFields()) {
        goBack = await this.updateItem();
      } else {
        error('Form is not valid');
      }
    } catch (err) {
      // console.log(err)
    } finally {
      if (goBack) {
        this.goBack();
      } else {
        this.setState({ loading: false });
      }
    }
  };

  render() {
    const { name, amount, interval, paid, loading } = this.state;
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
            underlineColorAndroid={'transparent'}
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
            defaultValue={interval}
            onChange={interval =>
              this.setState({ interval: parseInt(interval, 10) })
            }
            data={range(1, 13).map(n => {
              return { label: String(n), value: String(n) };
            })}
          />
        </CustomFieldContainer>

        <CustomFieldContainer>
          <SwitchInput
            label="Paid"
            defaultValue={paid}
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
    paddingTop: 15,
  },
});

export default connect(null, dispatch => ({
  itemUpdated: item => {
    dispatch(itemUpdated(item));
  },
}))(EditAnnualBudgetItemScreen);
