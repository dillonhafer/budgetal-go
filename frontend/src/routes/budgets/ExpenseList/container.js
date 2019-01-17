// Redux
import { connect } from 'react-redux';
import { selectExpense } from 'actions/budget-item-expenses';
import ExpenseList from './ExpenseList';

export default connect(
  state => ({
    budget: state.budget.budget,
    budgetItemExpenses: state.budget.budgetItemExpenses,
  }),
  dispatch => ({
    selectExpense: expense => dispatch(selectExpense(expense)),
  }),
)(ExpenseList);
