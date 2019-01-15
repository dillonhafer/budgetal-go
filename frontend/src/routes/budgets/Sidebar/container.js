import { connect } from 'react-redux';
import { updateBudgetCategory } from 'actions/budgets';
import Sidebar from './Sidebar';

export default connect(
  state => ({
    ...state.budget,
  }),
  dispatch => ({
    changeCategory: budgetCategory => {
      dispatch(updateBudgetCategory({ budgetCategory }));
    },
  }),
)(Sidebar);
