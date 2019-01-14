import { connect } from 'react-redux';
import { updateIncome } from 'actions/budgets';
import MonthlyIncomeModal from './MonthlyIncomeModal';

export default connect(
  state => ({
    ...state.budget,
  }),
  dispatch => ({
    updateIncome: income => {
      dispatch(updateIncome(income));
    },
  }),
)(MonthlyIncomeModal);
