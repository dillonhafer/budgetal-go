import React, { Component } from 'react';

// Redux
import { connect } from 'react-redux';

// Components
import BudgetItem from './BudgetItem';

// Helpers
import { map, find } from 'lodash';
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
    return (
      <TabPane tab={tab} key={'tab' + index}>
        <BudgetItem budgetItem={budgetItem} />
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
    const showItemList = budgetItems.length > 0;
    return (
      <div className="row new-budget-item">
        {showItemList && (
          <Tabs
            tabPosition="left"
            onChange={this.onTabChange}
            activeKey={this.state.activeKey}
          >
            {map(budgetItems, this.newBudgetItem)}
          </Tabs>
        )}
        {!showItemList && (
          <p className="emptyList">You haven't added any budget items yet.</p>
        )}
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
