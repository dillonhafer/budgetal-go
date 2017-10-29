import React, { Component } from 'react';

// Redux
import { connect } from 'react-redux';
import {
  itemsFetched,
  updatedSelectedItem,
  hideForm,
  toggleYearForm,
} from 'actions/annual-budget-items';

import { title, scrollTop } from 'window';
import { availableYears } from 'helpers';
import { AllAnnualBudgetItemsRequest } from 'api/annual-budget-items';

import moment from 'moment';

import { Row, Col, Button, Popover, Select, Icon } from 'antd';

import AnnualBudgetItemForm from './Form';
import AnnualBudgetItem from './AnnualBudgetItem';

import 'css/annual-budget-items.css';

const AnnualBudgetItemList = ({ annualBudgetItems, onClick }) => {
  return (
    <Row className="card-grid">
      {annualBudgetItems.map(item => (
        <AnnualBudgetItem item={item} key={item.id} />
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
  componentDidMount() {
    title(`${this.props.match.params.year} | Annual Budgets`);
    scrollTop();
    this.loadBudgetItems();
  }

  loadBudgetItems = async () => {
    try {
      const { year } = this.props.match.params;
      const resp = await AllAnnualBudgetItemsRequest(year);

      if (resp && resp.ok) {
        this.props.itemsFetched(resp.annualBudgetItems);
      }
    } catch (err) {
      console.log(err);
    }
  };

  changeYear = year => {
    this.props.history.push(`/annual-budgets/${year}`);
  };

  showNewModal = () => {
    const year = parseInt(this.props.match.params.year, 10);
    const selectedBudgetItem = {
      name: '',
      dueDate: moment(),
      amount: 1,
      paid: false,
      interval: 12,
      year,
    };

    this.props.updatedSelectedItem(selectedBudgetItem);
  };

  render() {
    const {
      showForm,
      annualBudgetItems,
      visible,
      selectedBudgetItem,
    } = this.props;

    const { year } = this.props.match.params;
    return (
      <div>
        <h1>
          Annual Budget for {year}
          <Popover
            content={
              <Select
                size="large"
                defaultValue={year}
                style={{ width: '100%' }}
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
            }
            title="Change Budget Year"
            placement="rightTop"
            trigger="click"
            visible={showForm}
            onVisibleChange={this.props.toggleYearForm}
          >
            <a onClick={this.showForm} style={{ marginLeft: '15px' }}>
              <Icon type="calendar" />
            </a>
          </Popover>
        </h1>
        <AnnualBudgetItemList
          annualBudgetItems={annualBudgetItems}
          onClick={this.showNewModal}
        />

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
    ...state.annualBudgetItems,
  }),
  dispatch => ({
    itemsFetched: annualBudgetItems => {
      dispatch(itemsFetched(annualBudgetItems));
    },
    updatedSelectedItem: selectedBudgetItem => {
      dispatch(updatedSelectedItem(selectedBudgetItem));
    },
    hideForm: _ => {
      dispatch(hideForm());
    },
    toggleYearForm: showForm => {
      dispatch(toggleYearForm(showForm));
    },
  }),
)(AnnualBudget);
