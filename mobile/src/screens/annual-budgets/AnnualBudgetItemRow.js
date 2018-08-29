import React, { PureComponent } from 'react';
import { StyleSheet, View, TouchableHighlight } from 'react-native';

// Redux
import { connect } from 'react-redux';
import { removeItem } from 'actions/annual-budget-items';

// API
import { DeleteAnnualBudgetItemRequest } from 'api/annual-budget-items';

// Helpers
import { currencyf } from 'utils/helpers';
import { round } from 'lodash';
import { notice, confirm } from 'notify';
import moment from 'moment';
import colors from 'utils/colors';

// Components
import { Bold, Medium, LightText } from 'components/Text';
import Swipeout from 'react-native-swipeout';
import { MaterialCommunityIcons } from '@expo/vector-icons';

class AnnualBudgetItemRow extends PureComponent {
  edit = () => {
    this.props.screenProps.layoutNavigate('EditAnnualBudgetItem', {
      annualBudgetItem: this.props.budgetItem,
    });
  };

  confirmDelete = () => {
    confirm({
      title: `Delete ${this.props.budgetItem.name}?`,
      okText: 'Delete',
      onOk: this.deleteItem,
    });
  };

  deleteItem = async () => {
    this.props.screenProps.goBack();
    const resp = await DeleteAnnualBudgetItemRequest(this.props.budgetItem.id);
    if (resp && resp.ok) {
      this.props.removeItem(this.props.budgetItem);
      notice(`${this.props.budgetItem.name} Deleted`);
    }
  };

  buttons = () => {
    return [
      {
        component: (
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <MaterialCommunityIcons name="pencil" color={'#fff'} size={20} />
          </View>
        ),
        backgroundColor: colors.primary,
        underlayColor: colors.primary + '70',
        onPress: this.edit,
      },
      {
        component: (
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <MaterialCommunityIcons name="delete" color={'#fff'} size={20} />
          </View>
        ),
        backgroundColor: colors.error,
        underlayColor: colors.error + '70',
        onPress: this.confirmDelete,
      },
    ];
  };

  month = () => {
    return currencyf(
      round(this.props.budgetItem.amount / this.props.budgetItem.interval),
    );
  };

  progress = () => {
    this.props.screenProps.layoutNavigate('AnnualBudgetProgress', {
      budgetItem: this.props.budgetItem,
    });
  };

  render() {
    const isTablet = this.props.screenProps.isTablet;
    const buttons = this.buttons().slice(isTablet ? 1 : 0);
    const { budgetItem } = this.props;
    const color = budgetItem.paid ? colors.success : colors.disabled;

    return (
      <Swipeout
        autoClose={true}
        backgroundColor={buttons[0].backgroundColor}
        right={buttons}
      >
        <TouchableHighlight underlayColor={'#CCC'} onPress={this.progress}>
          <View style={styles.itemRow} key={budgetItem.id}>
            <View>
              <Bold style={styles.itemName}>{budgetItem.name}</Bold>
              <Medium style={{ textAlign: 'center' }}>
                In order to reach{' '}
                <Bold style={styles.boldText}>
                  {currencyf(budgetItem.amount)}
                </Bold>
              </Medium>
              <Medium style={{ textAlign: 'center' }}>
                by{' '}
                <Bold style={styles.boldText}>
                  {moment(budgetItem.dueDate).format('LL')}
                </Bold>
              </Medium>
              <Medium style={{ textAlign: 'center' }}>you need to save</Medium>
              <Bold style={styles.boldText}>
                {this.month()}
                /month
              </Bold>
            </View>
            <View style={[styles.tag, { backgroundColor: color }]}>
              <LightText style={styles.tagText}>Paid</LightText>
            </View>
          </View>
        </TouchableHighlight>
      </Swipeout>
    );
  }
}

const styles = StyleSheet.create({
  itemRow: {
    backgroundColor: '#fff',
    padding: 15,
    justifyContent: 'center',
  },
  itemName: {
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 20,
    marginBottom: 10,
  },
  tag: {
    alignSelf: 'center',
    padding: 5,
    borderRadius: 5,
    width: 50,
  },
  tagText: {
    textAlign: 'center',
    color: '#fff',
  },
  boldText: {
    fontWeight: '800',
    textAlign: 'center',
  },
});

export default connect(
  null,
  dispatch => ({
    removeItem: item => {
      dispatch(removeItem(item));
    },
  }),
)(AnnualBudgetItemRow);
