import React, { Component } from 'react';

// Redux
import { connect } from 'react-redux';
import {
  itemsFetched,
  updatedSelectedItem,
  hideForm,
} from 'actions/annual-budget-items';

import { title } from 'window';
import { availableYears } from 'helpers';
import { AllAnnualBudgetItemsRequest } from 'api/annual-budget-items';

import moment from 'moment';

import { Spin, Row, Col, Button, Select } from 'antd';

import AnnualBudgetItemForm from './Form';
import AnnualBudgetItem from './AnnualBudgetItem';

import 'css/annual-budget-items.css';

const AnnualBudgetItemList = ({ annualBudgetItems, onClick, loading }) => {
  return (
    <Row className="card-grid">
      {annualBudgetItems.map(item => (
        <AnnualBudgetItem item={item} key={item.id} loading={loading} />
      ))}
      <Col className="card text-center" span={8}>
        <Button
          type="primary"
          icon="plus-circle"
          className="add-item-button"
          onClick={onClick}
          size="large"
        >
          Add an Item
        </Button>
      </Col>
    </Row>
  );
};

const Option = Select.Option;

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

  changeYear = year => {
    this.props.history.push(`/annual-budgets/${year}`);
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
        <h1>
          Annual Budget for {year}
          <div
            style={{
              float: 'right',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Select
              size="large"
              style={{ width: '100px' }}
              defaultValue={year}
              onChange={this.changeYear}
            >
              {availableYears().map(y => {
                return (
                  <Option key={y} value={y.toString()}>
                    {y}
                  </Option>
                );
              })}
            </Select>
          </div>
        </h1>
        <Spin delay={300} tip="Loading..." size="large" spinning={loading}>
          <AnnualBudgetItemList
            loading={loading}
            annualBudgetItems={annualBudgetItems}
            onClick={this.showNewModal}
          />
        </Spin>

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
