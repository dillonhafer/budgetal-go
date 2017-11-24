import React, { Component } from 'react';

// Redux
import { connect } from 'react-redux';
import { updateBudgetCategory } from 'actions/budgets';

// Components
// import ImportModal from './ImportModal';
import BudgetItemList from './BudgetItemList';
import { ImportCategoryRequest } from 'api/budgets';
import { notice } from 'window';

import { Card, Modal, Icon } from 'antd';

class BudgetCategory extends Component {
  clickImport = e => {
    e.preventDefault();
    const budgetCategory = this.props.currentBudgetCategory;
    Modal.confirm({
      okText: `Import ${budgetCategory.name}`,
      cancelText: 'Cancel',
      title: 'Import Budget Items',
      content: `Do you want to import budget items from your previous month's ${budgetCategory.name} category?`,
      onOk: this.importPreviousItems.bind(this, budgetCategory.id),
      onCancel() {},
    });
  };

  importPreviousItems = async budgetCategoryId => {
    const resp = await ImportCategoryRequest(budgetCategoryId);
    if (resp && resp.ok) {
      this.props.importedBudgetItems(resp.imported);
      notice(resp.message);
    }
  };

  emptyList(hasBudgetItems, isLoading) {
    if (!hasBudgetItems && !isLoading) {
      return (
        <p className="text-center">You haven't added any budget items yet.</p>
      );
    }
  }

  render() {
    const budgetCategory = this.props.currentBudgetCategory;
    return (
      <div className="budget-category-row">
        <Card
          noHovering
          title={budgetCategory.name}
          extra={
            <a
              onClick={this.clickImport}
              title="Import items from previous budget"
            >
              <Icon type="export" />
            </a>
          }
        >
          <div className="body-row">
            <ul className="main-budget-categories">
              <li>{!this.props.loading && <BudgetItemList />}</li>
            </ul>
          </div>
        </Card>
      </div>
    );
  }
}

export default connect(
  state => ({
    ...state.budget,
  }),
  dispatch => ({
    changeCategory: budgetCategory => {
      dispatch(updateBudgetCategory({ budgetCategory }));
    },
  }),
)(BudgetCategory);
