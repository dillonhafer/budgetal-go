import React, { Component } from 'react';

// Redux
import { connect } from 'react-redux';
import { newBudgetItem } from 'actions/budgets';

// Components
import BudgetItem from './BudgetItem';

// Helpers
import { map, find } from 'lodash';
import { Button, Tabs, Icon } from 'antd';
const TabPane = Tabs.TabPane;

class BudgetItemList extends Component {
  newBudgetItem = (budgetItem, index) => {
    const tab = budgetItem.name ? budgetItem.name : <Icon type="question" />;
    return (
      <TabPane
        tab={tab}
        key={`tab-${budgetItem.budgetCategoryId}-${budgetItem.id}`}
      >
        <BudgetItem budgetItem={budgetItem} />
      </TabPane>
    );
  };

  addBudgetItem = e => {
    e.preventDefault();
    this.props.newBudgetItem(this.props.currentBudgetCategory.id);
    let interval = null;
    interval = setInterval(() => {
      const newLink = document.querySelector(
        '.ant-tabs-tab .anticon.anticon-question',
      );
      if (newLink) {
        newLink.click();
        window.clearInterval(interval);
        document.querySelector('.ant-card-head-title').scrollIntoView();
      }
    }, 100);
  };

  currentItems = item => {
    return item.budgetCategoryId === this.props.currentBudgetCategory.id;
  };

  render() {
    const budgetItems = this.props.budgetItems.filter(this.currentItems);
    const noNewItems =
      find(budgetItems, i => {
        return i.id === null;
      }) === undefined;
    const showItemList = budgetItems.length > 0;
    return (
      <div className="row new-budget-item">
        {showItemList && (
          <Tabs tabPosition="left">{map(budgetItems, this.newBudgetItem)}</Tabs>
        )}
        {!showItemList && (
          <p className="emptyList">You haven't added any budget items yet.</p>
        )}
        <br />
        <Button
          icon="plus-circle"
          onClick={this.addBudgetItem}
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
  dispatch => ({
    newBudgetItem: budgetCategoryId => {
      dispatch(newBudgetItem(budgetCategoryId));
    },
  }),
)(BudgetItemList);
