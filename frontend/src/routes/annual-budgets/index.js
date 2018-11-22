import React, { Component } from 'react';

// Redux
import { connect } from 'react-redux';
import {
  itemsFetched,
  updatedSelectedItem,
  hideForm,
} from 'actions/annual-budget-items';

import { title } from 'window';
import { availableYears } from '@shared/helpers';
import { AllAnnualBudgetItemsRequest } from '@shared/api/annual-budget-items';

import moment from 'moment';

import AnnualBudgetItemForm from './Form';
import AnnualBudgetItem from './AnnualBudgetItem';
import { Spinner, Text, Button, Pane, Heading, Select } from 'evergreen-ui';

const AnnualBudgetItemList = ({ annualBudgetItems, onClick, loading }) => {
  return (
    <Pane
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      flexWrap="wrap"
    >
      {annualBudgetItems.map(item => (
        <AnnualBudgetItem item={item} key={item.id} loading={loading} />
      ))}
      <Pane
        width={380}
        minHeight={200}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Button
          height={40}
          appearance="primary"
          onClick={onClick}
          iconBefore="add"
        >
          Add an Item
        </Button>
      </Pane>
      <Pane width={380} />
    </Pane>
  );
};

class AnnualBudget extends Component {
  state = {
    loading: false,
  };

  componentDidMount() {
    title(`${this.props.match.params.year} | Annual Budgets`);
    this.loadBudgetItems();
  }

  loadBudgetItems = async () => {
    try {
      this.setState({ loading: true });
      const { year } = this.props.match.params;
      const resp = await AllAnnualBudgetItemsRequest(year);

      if (resp && resp.ok) {
        this.props.itemsFetched(resp.annualBudgetId, resp.annualBudgetItems);
      }
    } catch (err) {
      console.log(err);
    } finally {
      this.setState({ loading: false });
    }
  };

  changeYear = e => {
    this.props.history.push(`/annual-budgets/${e.target.value}`);
  };

  showNewModal = () => {
    const selectedBudgetItem = {
      name: '',
      dueDate: moment(),
      amount: 1,
      paid: false,
      interval: 12,
      annualBudgetId: this.props.annualBudgetId,
    };

    this.props.updatedSelectedItem(selectedBudgetItem);
  };

  render() {
    const { annualBudgetItems, visible, selectedBudgetItem } = this.props;

    const { loading } = this.state;
    const { year } = this.props.match.params;
    return (
      <div>
        <Pane
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Heading size={800}>ANNUAL BUDGET FOR {year}</Heading>
          <Select
            value={year}
            onChange={this.changeYear}
            flex="unset"
            width={100}
          >
            {availableYears().map(y => {
              return (
                <option key={y} value={y.toString()}>
                  {y}
                </option>
              );
            })}
          </Select>
        </Pane>

        <Pane marginY={16}>
          {(loading && (
            <Pane textAlign="center" marginY={56}>
              <Spinner marginX="auto" />
              <Text marginY={16}>Loading...</Text>
            </Pane>
          )) || (
            <AnnualBudgetItemList
              loading={loading}
              annualBudgetItems={annualBudgetItems}
              onClick={this.showNewModal}
            />
          )}
        </Pane>

        <AnnualBudgetItemForm
          budgetItem={selectedBudgetItem}
          visible={visible}
          onCancel={this.props.hideForm}
        />
      </div>
    );
  }
}

export default connect(
  state => ({
    ...state.annualBudgetId,
    ...state.annualBudgetItems,
  }),
  dispatch => ({
    itemsFetched: (annualBudgetId, annualBudgetItems) => {
      dispatch(itemsFetched(annualBudgetId, annualBudgetItems));
    },
    updatedSelectedItem: selectedBudgetItem => {
      dispatch(updatedSelectedItem(selectedBudgetItem));
    },
    hideForm: _ => {
      dispatch(hideForm());
    },
  }),
)(AnnualBudget);
