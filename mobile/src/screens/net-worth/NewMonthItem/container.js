import { connect } from 'react-redux';
import { createNetWorthItem } from 'actions/net-worth-items';
import NewMonthItemScreen from './NewMonthItem';

export default connect(
  state => ({ ...state.netWorth }),
  dispatch => ({
    createNetWorthItem: ({ year, month, item }) =>
      dispatch(createNetWorthItem({ year, month, item })),
  }),
)(NewMonthItemScreen);
