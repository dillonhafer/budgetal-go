import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, Modal, View, Text } from 'react-native';

// Redux
import { connect } from 'react-redux';
import { updateIncome } from 'actions/budgets';

// API
import { UpdateIncomeRequest } from 'api/budgets';

// Components
import { BlurView } from 'expo';
import { Feather, Ionicons } from '@expo/vector-icons';
import { currencyf } from 'utils/helpers';
import colors from 'utils/colors';
import MoneyKeyboard from 'utils/MoneyKeyboard';
import { PrimaryButton, FieldContainer } from 'forms';
import { notice } from 'notify';

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

  onNumberChanged = number => {
    this.setState({ income: number });
  };

  handleSubmit = async () => {
    this.setState({ loading: true });
    try {
      const { year, month } = this.props.budget;
      const { income } = this.state;
      const resp = await UpdateIncomeRequest({ year, month, income });
      if (resp && resp.ok) {
        this.props.updateIncome(income);
        this.hideModal();
        setTimeout(() => {
          notice('Saved Monthly Income');
        }, 500);
      }
    } catch (err) {
      console.log(err);
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const { visible, loading, income } = this.state;
    const { budget } = this.props;
    const invalid = income <= 0;

    return (
      <View>
        <TouchableOpacity onPress={this.showModal}>
          <Feather
            name="edit"
            size={24}
            color={'#037aff'}
            style={{
              fontWeight: '100',
              paddingRight: 15,
            }}
          />
        </TouchableOpacity>
        <Modal visible={visible} animationType={'slide'} transparent={true}>
          <BlurView tint="light" intensity={95} style={styles.modal}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={this.hideModal}
            >
              <Ionicons
                name="ios-close-circle-outline"
                size={24}
                color={'#037aff'}
              />
            </TouchableOpacity>

            <View style={styles.content}>
              <Text
                style={{ textAlign: 'center', fontSize: 18, fontWeight: '700' }}
              >
                Current Income
              </Text>
              <Text style={{ textAlign: 'center', fontSize: 18 }}>
                {currencyf(budget.income)}
              </Text>
              <PrimaryButton
                title="Update Income"
                onPress={this.handleSubmit}
                loading={invalid || loading}
              />
            </View>

            <MoneyKeyboard onChange={this.onNumberChanged} />
          </BlurView>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
  },
  closeButton: {
    paddingLeft: 15,
    paddingTop: 25,
    paddingBottom: 15,
  },
});

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
