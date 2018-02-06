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
import { updateBudgetItem } from 'actions/budgets';

// API
import { UpdateItemRequest } from 'api/budget-items';

// Helpers
import { error, notice } from 'notify';

// Components
import { PrimaryButton, DangerButton, FieldContainer } from 'forms';
import MoneyInput from 'forms/MoneyInput';

class EditBudgetItemScreen extends Component {
  goBack = () => {
    this.props.navigation.goBack();
  };

  inputs = [];

  state = {
    loading: false,
    showMoneyKeyboard: false,
    name: '',
    amount: 0.0,
  };

  componentDidMount() {
    const { budgetItem } = this.props.navigation.state.params;
    this.setState({
      id: budgetItem.id,
      name: budgetItem.name,
      amount: budgetItem.amount,
    });
  }

  validateFields = () => {
    const { name, amount } = this.state;
    return name.length > 0 && amount > 0;
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
    const { id, name, amount } = this.state;

    try {
      const resp = await UpdateItemRequest({
        id,
        name,
        amount,
      });

      if (resp && resp.ok) {
        this.props.updateBudgetItem(resp.budgetItem);
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
        await this.updateItem();
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
    const { name, amount, loading, showMoneyKeyboard } = this.state;
    const valid = this.validateFields();

    return (
      <ScrollView contentContainerStyle={styles.container}>
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
            title="Budget Item Amount"
            displayAmount={amount}
            defaultValue={(amount * 100).toFixed()}
            onChange={amount => this.setState({ amount })}
          />
        </FieldContainer>

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
    backgroundColor: 'transparent',
    alignItems: 'center',
    flexDirection: 'column',
    paddingBottom: 40,
    paddingTop: 15,
  },
});

export default connect(
  state => ({}),
  dispatch => ({
    updateBudgetItem: item => {
      dispatch(updateBudgetItem(item));
    },
  }),
)(EditBudgetItemScreen);
