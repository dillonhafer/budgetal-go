import { connect } from 'react-redux';
import {
  updateBudgetItem,
  updateNullBudgetItem,
  removeBudgetItem,
} from 'actions/budgets';
import BudgetItem from './BudgetItem';

export default connect(
  state => ({
    budgetItemExpenses: state.budget.budgetItemExpenses,
  }),
  dispatch => ({
    updateBudgetItem: income => {
      dispatch(updateBudgetItem(income));
    },
    updateNullBudgetItem: item => {
      dispatch(updateNullBudgetItem(item));
    },
    removeBudgetItem: item => {
      dispatch(removeBudgetItem(item));
    },
  }),
)(BudgetItem);
