import { connect } from 'react-redux';
import { budgetLoaded, updateBudgetCategory } from 'actions/budgets';
import Budget from './Budgets';

export default connect(
  state => ({
    budget: state.budget.budget,
  }),
  dispatch => ({
    budgetLoaded: ({
      budget,
      budgetCategories,
      budgetItems,
      budgetItemExpenses,
    }) => {
      dispatch(
        budgetLoaded({
          budget,
          budgetCategories,
          budgetItems,
          budgetItemExpenses,
        }),
      );
    },
    changeCategory: budgetCategory => {
      dispatch(updateBudgetCategory({ budgetCategory }));
    },
  }),
)(Budget);
