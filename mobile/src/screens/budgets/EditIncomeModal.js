import React, { Component } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';

// Redux
import { connect } from 'react-redux';
import { updateIncome } from 'actions/budgets';

// API
import { UpdateIncomeRequest } from '@shared/api/budgets';

// Components
import { Ionicons } from '@expo/vector-icons';
import { currencyf } from '@shared/helpers';
import { notice, error } from 'notify';
import MoneyInputModal from 'forms/MoneyInputModal';

class EditIncomeModal extends Component {
  state = {
    loading: false,
    visible: false,
    income: '0',
  };

  showModal = () => {
    this.setState({ visible: true });
  };

  hideModal = () => {
    this.setState({ visible: false, income: '0' });
  };

  handleSubmit = async income => {
    this.setState({ loading: true });
    try {
      const { year, month } = this.props.budget;
      const resp = await UpdateIncomeRequest({ year, month, income });
      if (resp && resp.ok) {
        this.props.updateIncome(income);
        this.hideModal();
        notice('Saved Monthly Income');
      }
    } catch (err) {
      error('Could not update monthly income');
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const { visible } = this.state;
    const { budget } = this.props;

    return (
      <View>
        <TouchableOpacity onPress={this.showModal}>
          <Ionicons
            name="ios-cash"
            size={30}
            color={'#037aff'}
            style={{
              paddingRight: 15,
            }}
          />
        </TouchableOpacity>
        <MoneyInputModal
          defaultValue={(budget.income * 100).toFixed()}
          title={
            <Text>
              <Text
                style={{ textAlign: 'center', fontSize: 18, fontWeight: '700' }}
              >
                Current Income
                {'\n'}
              </Text>
              <Text style={{ textAlign: 'center', fontSize: 18 }}>
                {currencyf(budget.income)}
              </Text>
            </Text>
          }
          visible={visible}
          onOk={this.handleSubmit}
          onCancel={this.hideModal}
        />
      </View>
    );
  }
}

export default connect(
  state => ({
    budget: state.budget.budget,
  }),
  dispatch => ({
    updateIncome: income => {
      dispatch(updateIncome(income));
    },
  }),
)(EditIncomeModal);
