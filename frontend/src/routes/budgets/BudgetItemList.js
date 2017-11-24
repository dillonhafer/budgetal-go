import React, { Component } from 'react';
import { connect } from 'react-redux';
import { map, find } from 'lodash';
import { currencyf } from 'helpers';
import { Button, Tabs, Icon } from 'antd';
const TabPane = Tabs.TabPane;

class BudgetItemList extends Component {
  state = {
    activeKey: 'tab0',
  };

  componentWillReceiveProps = nextProps => {
    if (
      nextProps.currentBudgetCategory.id !== this.props.currentBudgetCategory.id
    ) {
      this.resetTabs();
    }

    if (this.props.budgetItems.length > nextProps.budgetItems.length) {
      this.resetTabs();
    }
  };

  resetTabs = () => {
    this.setState({ activeKey: 'tab0' });
  };

  newBudgetItem = (budgetItem, index) => {
    const tab = budgetItem.name.length ? (
      budgetItem.name
    ) : (
      <Icon type="question" />
    );
    /*<BudgetItemContainer budgetItem={budgetItem} />*/
    return (
      <TabPane tab={tab} key={'tab' + index}>
        {currencyf(budgetItem.amount)}
      </TabPane>
    );
  };

  addBudgetItem = e => {
    e.preventDefault();
    this.props.newBudgetItem();
    this.setState({ activeKey: 'tab' + this.props.budgetItems.length });
  };

  onTabChange = activeKey => {
    this.setState({ activeKey });
  };

  currentItems = item => {
    return item.budgetCategoryId === this.props.currentBudgetCategory.id;
  };

  render() {
    const noNewItems =
      find(
        this.props.budgetItems,
        budgetItem => budgetItem.id === undefined,
      ) === undefined;
    const onClickHandle = noNewItems
      ? this.addBudgetItem
      : e => e.preventDefault();

    const budgetItems = this.props.budgetItems.filter(this.currentItems);
    return (
      <div className="row new-budget-item">
        <Tabs
          tabPosition="left"
          onChange={this.onTabChange}
          activeKey={this.state.activeKey}
        >
          {map(budgetItems, this.newBudgetItem)}
        </Tabs>
        <br />
        <Button
          icon="plus-circle"
          onClick={onClickHandle}
          type="primary"
          size="large"
          disabled={!noNewItems}
        >
          Add a Budget Item
        </Button>
      </div>
    );
  }
}

export default connect(
  state => ({
    ...state.budget,
  }),
  dispatch => ({}),
)(BudgetItemList);
