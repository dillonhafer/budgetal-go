import React, { Component } from 'react';

// Redux
import { connect } from 'react-redux';
import {
  ANNUAL_ITEMS_FETCHED,
  ANNUAL_ITEMS_SHOW_FORM,
  ANNUAL_ITEMS_HIDE_FORM,
  ANNUAL_ITEMS_TOGGLE_YEAR_FORM,
} from 'action-types';

import { title, scrollTop } from 'window';
import { availableYears, currencyf } from 'helpers';
import { AllAnnualBudgetItemsRequest } from 'api/annual-budget-items';
import moment from 'moment';
import { round } from 'lodash';

import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Card from 'antd/lib/card';
import Button from 'antd/lib/button';
import Popover from 'antd/lib/popover';
import Select from 'antd/lib/select';
import Icon from 'antd/lib/icon';
import Dropdown from 'antd/lib/dropdown';
import Tag from 'antd/lib/tag';
import Menu from 'antd/lib/menu';

import AnnualBudgetItemForm from './Form';

import 'css/annual-budget-items.css';

const getMenu = ({ progress, editItem, deleteItem }) => {
  return (
    <Menu>
      <Menu.Item>
        <a className="primary-color" onClick={progress}>
          <Icon type="area-chart" /> Progress
        </a>
      </Menu.Item>
      <Menu.Item>
        <a className="primary-color" onClick={editItem}>
          <Icon type="edit" /> Edit
        </a>
      </Menu.Item>
      <Menu.Item>
        <a className="alert-color" onClick={deleteItem}>
          <Icon type="delete" /> Delete
        </a>
      </Menu.Item>
    </Menu>
  );
};

const AnnualBudgetItem = ({ item, handleOnCardClick, handleOnCardDelete }) => {
  const name = item.name;
  const loading = item.loading;
  const amount = currencyf(item.amount);
  const date = moment(item.dueDate).format('LL');
  const month = currencyf(round(item.amount / item.payment_intervals));
  const color = item.paid ? '#87d068' : '#cacaca';
  const editItem = () => {
    const i = { ...item, dueDate: moment(item.dueDate) };
    handleOnCardClick(i);
  };

  const menu = getMenu({
    progress: _ => {},
    editItem,
    deleteItem: handleOnCardDelete,
  });

  return (
    <Col className="card" xs={24} sm={12} md={8} lg={8}>
      <Card
        loading={loading}
        noHovering
        title={name}
        extra={
          <div className="annual-item-crud">
            <Dropdown overlay={menu} trigger={['click']}>
              <Button type="ghost" shape="circle" icon="ellipsis" />
            </Dropdown>
          </div>
        }
      >
        <div className="text-center">
          <p>
            In order to reach <b>{amount}</b>
            <br />
            by <b>{date}</b>
            <br />
            you need to save
            <br />
            <b>{month}/month</b>
            <br />
          </p>
          <Tag color={color}>Paid</Tag>
        </div>

        {/*this.getProgressModal(item, this.state.showProgress)*/}
      </Card>
    </Col>
  );
};

const AnnualBudgetItemList = ({
  annualBudgetItems,
  onClick,
  handleOnDeleteClick,
  handleOnCardClick,
}) => {
  const cards = annualBudgetItems.map((item, index) => {
    return (
      <AnnualBudgetItem
        handleOnDeleteClick={handleOnDeleteClick}
        handleOnCardClick={handleOnCardClick}
        item={item}
        key={index}
      />
    );
  });

  return (
    <Row className="card-grid">
      {cards}
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
          handleOnCardClick={this.props.updatedSelectedItem}
          handleOnDeleteClick={this.handleOnDeleteClick}
        />

        <AnnualBudgetItemForm
          budgetItem={selectedBudgetItem}
          visible={visible}
          onCancel={this.props.hideForm}
          afterSubmit={_ => {}}
        />
      </div>
    );
  }
}

const itemsFetched = annualBudgetItems => {
  return {
    type: ANNUAL_ITEMS_FETCHED,
    annualBudgetItems,
  };
};

const updatedSelectedItem = selectedBudgetItem => {
  return {
    type: ANNUAL_ITEMS_SHOW_FORM,
    selectedBudgetItem,
  };
};

const hideForm = () => {
  return {
    type: ANNUAL_ITEMS_HIDE_FORM,
  };
};

const toggleYearForm = showForm => {
  return {
    type: ANNUAL_ITEMS_TOGGLE_YEAR_FORM,
    showForm,
  };
};

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
