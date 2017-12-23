import React, { PureComponent } from 'react';
import {
  StyleSheet,
  TextInput,
  StatusBar,
  View,
  ScrollView,
} from 'react-native';

// Redux
import { connect } from 'react-redux';
import { createdBudgetItem } from 'actions/budgets';

// API
import { CreateItemRequest } from 'api/budget-items';

// Helpers
import { error, notice } from 'notify';

// Components
import { PrimaryButton, DangerButton, FieldContainer } from 'forms';
import MoneyInput from 'forms/MoneyInput';

class NewBudgetItemScreen extends PureComponent {
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
    const { budgetCategory } = this.props.navigation.state.params;
    this.setState({ budgetCategory });
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

  createItem = async () => {
    const { name, amount, budgetCategory } = this.state;

    try {
      const resp = await CreateItemRequest({
        name,
        amount,
        budgetCategoryId: budgetCategory.id,
      });

      if (resp && resp.ok) {
        this.props.createdBudgetItem(resp.budgetItem);
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
    const { name, amount, loading, showMoneyKeyboard } = this.state;
    const valid = this.validateFields();

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <StatusBar barStyle="dark-content" />
        <FieldContainer position="first">
          <TextInput
            autoFocus={true}
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
    backgroundColor: '#ececec',
    alignItems: 'center',
    flexDirection: 'column',
    paddingBottom: 40,
  },
});

export default connect(
  state => ({}),
  dispatch => ({
    createdBudgetItem: item => {
      dispatch(createdBudgetItem(item));
    },
  }),
)(NewBudgetItemScreen);
