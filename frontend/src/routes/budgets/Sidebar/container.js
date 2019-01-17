import { connect } from 'react-redux';
import { updateBudgetCategory } from 'actions/budgets';
import Sidebar from './Sidebar';

export default connect(
  state => ({
    currentBudgetCategory: state.budget.currentBudgetCategory,
    budgetItems: state.budget.budgetItems,
    budgetCategories: state.budget.budgetCategories,
    budgetItemExpenses: state.budget.budgetItemExpenses,
  }),
  dispatch => ({
    changeCategory: budgetCategory => {
      dispatch(updateBudgetCategory({ budgetCategory }));
    },
  }),
)(Sidebar);
