import { connect } from 'react-redux';
import { importedBudgetItems, updateBudgetCategory } from 'actions/budgets';
import BudgetCategory from './BudgetCategory';

export default connect(
  state => ({
    ...state.budget,
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
