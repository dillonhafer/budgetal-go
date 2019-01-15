// Redux
import { connect } from 'react-redux';
import {
  createdExpense,
  updateExpense,
  unselectExpense,
} from 'actions/budget-item-expenses';
import ExpenseForm from './ExpenseForm';

export default connect(
  state => ({
    expense: state.budget.selectedExpense,
    visible: state.budget.showExpenseModal,
  }),
  dispatch => ({
    unselectExpense: () => dispatch(unselectExpense()),
    createdExpense: expense => {
      dispatch(createdExpense(expense));
    },
    updateExpense: expense => dispatch(updateExpense(expense)),
  }),
)(ExpenseForm);
