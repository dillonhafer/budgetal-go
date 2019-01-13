import { connect } from 'react-redux';
import { MORTGAGE_CALCULATOR_UPDATED } from 'action-types';
import MortgageCalculator from './Mortgage';

const updateState = state => {
  return {
    type: MORTGAGE_CALCULATOR_UPDATED,
    state,
  };
};

export default connect(
  state => state.mortgageCalculator,
  dispatch => ({
    updateState: state => dispatch(updateState(state)),
  }),
)(MortgageCalculator);
