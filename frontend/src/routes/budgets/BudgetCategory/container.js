import { connect } from 'react-redux';
import { importedBudgetItems, updateBudgetCategory } from 'actions/budgets';
import BudgetCategory from './BudgetCategory';

export default connect(
  state => ({
    budget: state.budget.budget,
    currentBudgetCategory: state.budget.currentBudgetCategory,
    budgetItems: state.budget.budgetItems,
    budgetItemExpenses: state.budget.budgetItemExpenses,
  }),
  dispatch => ({
    importedBudgetItems: budgetItems => {
      dispatch(importedBudgetItems(budgetItems));
    },
    changeCategory: budgetCategory => {
      dispatch(updateBudgetCategory({ budgetCategory }));
    },
  }),
)(BudgetCategory);
