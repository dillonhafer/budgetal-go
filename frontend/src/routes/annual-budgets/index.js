import React, { Component } from 'react';

// Redux
import { connect } from 'react-redux';
import {
  itemsFetched,
  updatedSelectedItem,
  hideForm,
} from 'actions/annual-budget-items';

import { title, scrollTop } from 'window';
import { availableYears } from '@shared/helpers';
import { AllAnnualBudgetItemsRequest } from '@shared/api/annual-budget-items';

import AnnualBudgetItemForm from './Form';
import AnnualBudgetItem from './AnnualBudgetItem';
import { Button, Pane, Select } from 'evergreen-ui';
import Spinner from 'components/Spinner';
import Header from 'components/Header';

const padding = (group, length) => {
  return length <= 3 ? 3 % length : length % 3 === 0 ? 0 : 3 - (length % 3);
};

const itemPadding = itemLength => {
  const blankItems = [];
  const amountToPad = padding(3, itemLength);

  for (let i = 0; i < amountToPad; i++) {
    blankItems.push(
      <Pane
        key={i}
        margin={16}
        marginLeft={0}
        marginBottom={0}
        minWidth={252}
        minHeight={200}
        display="flex"
        flex="1 0 30%"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      />,
    );
  }

  return blankItems;
};

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
        margin={16}
        marginLeft={0}
        marginBottom={0}
        minWidth={252}
        minHeight={200}
        display="flex"
        flex="1 0 30%"
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

      {itemPadding(annualBudgetItems.length + 1)}
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
    scrollTop();
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
      dueDate: '',
      amount: 0,
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
      <Pane>
        <Header
          subtext="For things that happen a few times a year"
          heading={`Annual Budgets for ${year}`}
        >
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
        </Header>

        <Pane paddingX={24}>
          {(loading && <Spinner visible={loading} />) || (
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
      </Pane>
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
    hideForm: () => {
      dispatch(hideForm());
    },
  }),
)(AnnualBudget);
