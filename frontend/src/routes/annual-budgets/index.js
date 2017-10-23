import React, {Component} from 'react';
import {title, scrollTop} from 'window';
import {availableYears, currencyf} from 'helpers';
import {AllAnnualBudgetItemsRequest} from 'api/annual-budget-items';
import moment from 'moment';
import {round} from 'lodash';

import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Card from 'antd/lib/card';
import Button from 'antd/lib/button';
import Popover from 'antd/lib/popover';
import Select from 'antd/lib/select';
import Icon from 'antd/lib/icon';
import Modal from 'antd/lib/modal';
import Dropdown from 'antd/lib/dropdown';
import Tag from 'antd/lib/tag';
import Menu from 'antd/lib/menu';

import AnnualBudgetItemForm from './Form';

import 'css/annual-budget-items.css';

const getMenu = ({progress, editItem, deleteItem}) => {
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

const AnnualBudgetItem = ({item, onClick}) => {
  const name = item.name;
  const loading = item.loading;
  const amount = currencyf(item.amount);
  const date = moment(item.due_date).format('LL');
  const month = currencyf(round(item.amount / item.payment_intervals));
  const color = item.paid ? '#87d068' : '#cacaca';

  const menu = getMenu({
    progress: _ => {},
    editItem: _ => {},
    deleteItem: _ => {},
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
  state = {
    showForm: false,
    annualBudgetItems: [],
    selectedBudgetItem: {},
  };

  componentDidMount() {
    title(`${this.props.match.params.year} | Annual Budgets`);
    scrollTop();
    this.loadBudgetItems();
  }

  loadBudgetItems = async _ => {
    try {
      const {year} = this.props.match.params;
      const resp = await AllAnnualBudgetItemsRequest(year);

      if (resp && resp.ok) {
        this.setState({annualBudgetItems: resp.annualBudgetItems});
      }
    } catch (err) {
      console.log(err);
    }
  };

  handleVisibleChange = showForm => {
    this.setState({showForm});
  };

  changeYear = year => {
    this.props.history.push(`/annual-budgets/${year}`);
  };

  showNewModal = () => {
    const {year} = this.props.match.params;
    const selectedBudgetItem = {
      id: null,
      name: '',
      dueDate: new Date(),
      amount: 1,
      paid: false,
      interval: 12,
      year,
    };
    this.setState({
      selectedBudgetItem,
      visible: true,
    });
    console.log('sett igt', selectedBudgetItem);
  };

  handleCancel = () => {
    this.setState({visible: false});
  };

  render() {
    const {
      showForm,
      annualBudgetItems,
      visible,
      selectedBudgetItem,
    } = this.state;
    console.log(selectedBudgetItem);
    const {year} = this.props.match.params;
    const okText = selectedBudgetItem.id ? 'Update Item' : 'Create Item';
    return (
      <div>
        <h1>
          Annual Budget for {year}
          <Popover
            content={
              <Select
                size="large"
                defaultValue={`${year}`}
                style={{width: '100%'}}
                onChange={this.changeYear}
              >
                {availableYears().map(year => {
                  return (
                    <Option key={year} value={year.toString()}>
                      {year}
                    </Option>
                  );
                })}
              </Select>
            }
            title="Change Budget Year"
            placement="rightTop"
            trigger="click"
            visible={showForm}
            onVisibleChange={this.handleVisibleChange}
          >
            <a onClick={this.showForm} style={{marginLeft: '15px'}}>
              <Icon type="calendar" />
            </a>
          </Popover>
        </h1>
        <AnnualBudgetItemList
          annualBudgetItems={annualBudgetItems}
          onClick={this.showNewModal}
          handleOnCardClick={this.handleOnCardClick}
          handleOnDeleteClick={this.handleOnDeleteClick}
        />
        <Modal
          title="Annual Budget Item"
          width={300}
          visible={visible}
          okText={okText}
          onOk={this.handleCancel}
          onCancel={this.handleCancel}
        >
          <AnnualBudgetItemForm
            budgetItem={selectedBudgetItem}
            afterSubmit={item => {
              this.handleCancel();
              const items = this.state.annualBudgetItems;
              const idx = items.findIndex(i => i.id === item.id);

              if (idx !== undefined) {
                this.setState({
                  annualBudgetItems: [
                    ...items.slice(0, idx),
                    item,
                    ...items.slice(idx),
                  ],
                });
              } else {
                this.setState({
                  annualBudgetItems: [...items, item],
                });
              }
            }}
          />
        </Modal>
      </div>
    );
  }
}

export default AnnualBudget;
