import { connect } from 'react-redux';
import { deleteNetWorthItem } from 'actions/net-worth-items';
import MonthList from './MonthList';

const mapStateToProps = state => {
  return {
    assets: state.netWorth.assets,
    liabilities: state.netWorth.liabilities,
    months: state.netWorth.months,
  };
};

const mapDispatchToProps = dispatch => ({
  deleteNetWorthItem: item => dispatch(deleteNetWorthItem(item)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MonthList);
