import React, { PureComponent } from 'react';

// Redux
import { connect } from 'react-redux';
import { newBudgetItem, updateSelectedBudgetItemID } from 'actions/budgets';

// Components
import BudgetItem from './BudgetItem';

// Helpers
import { Button, Paragraph, Pane, Tablist, Tab } from 'evergreen-ui';

class BudgetItemList extends PureComponent {
  addBudgetItem = e => {
    e.preventDefault();
    this.props.newBudgetItem(this.props.currentBudgetCategory.id);
    document.querySelector('.category-card-header').scrollIntoView();
  };

  currentBudgetItems = () => {
    return this.props.budgetItems.filter(
      item => item.budgetCategoryId === this.props.currentBudgetCategory.id,
    );
  };

  render() {
    const budgetItems = this.currentBudgetItems();
    const noNewItems =
      budgetItems.find(i => {
        return i.id === null;
      }) === undefined;
    const showItemList = budgetItems.length > 0;
    const item = budgetItems.find(
      i => i.id === this.props.selectedBudgetItemID,
    );

    return (
      <Pane className="row new-budget-item">
        <Pane>
          <Tablist marginBottom={16} marginRight={16}>
            {budgetItems.map((item, index) => (
              <Tab
                key={item.id}
                id={item.id}
                onSelect={() => this.props.updateSelectedBudgetItemID(item.id)}
                isSelected={item.id === this.props.selectedBudgetItemID}
                aria-controls={`panel-${item.name}`}
              >
                {item.id === null ? '???' : item.name}
              </Tab>
            ))}
            <Button
              height={28}
              onClick={this.addBudgetItem}
              iconBefore="plus"
              disabled={!noNewItems}
            >
              New
            </Button>
          </Tablist>
          {item && (
            <Pane padding={16} borderTop="muted" flex="1">
              <Pane
                key={item.id}
                id={`panel-${item.id}`}
                role="tabpanel"
                aria-labelledby={item.name}
              >
                <BudgetItem budgetItem={item} />
              </Pane>
            </Pane>
          )}
        </Pane>
        {!showItemList && (
          <Paragraph padding="2rem" fontSize="1rem" textAlign="center">
            You haven't added any budget items yet.
          </Paragraph>
        )}
      </Pane>
    );
  }
}

export default connect(
  state => ({
    budgetItems: state.budget.budgetItems,
    currentBudgetCategory: state.budget.currentBudgetCategory,
    selectedBudgetItemID: state.budget.selectedBudgetItemID,
  }),
  dispatch => ({
    newBudgetItem: budgetCategoryId =>
      dispatch(newBudgetItem(budgetCategoryId)),
    updateSelectedBudgetItemID: budgetItemID =>
      dispatch(updateSelectedBudgetItemID(budgetItemID)),
  }),
)(BudgetItemList);
