// Redux
import { connect } from 'react-redux';
import { selectExpense } from 'actions/budget-item-expenses';
import ExpenseList from './ExpenseList';

export default connect(
  state => ({
    ...state.budget,
  }),
  dispatch => ({
    selectExpense: expense => dispatch(selectExpense(expense)),
  }),
)(ExpenseList);
