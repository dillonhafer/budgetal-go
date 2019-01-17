import { connect } from 'react-redux';
import { loadYear, refreshYear, importNetWorthItems } from 'actions/net-worth';
import { deleteAssetLiability } from 'actions/net-worth-assets';
import NetWorthScreen from './NetWorth';

export default connect(
  state => ({
    assets: state.netWorth.assets,
    liabilities: state.netWorth.liabilities,
    months: state.netWorth.months,
    loading: state.netWorth.loading,
    refreshing: state.netWorth.refreshing,
    year: state.netWorth.year,
  }),
  dispatch => ({
    loadNetWorthItems: ({ year }) => {
      dispatch(loadYear({ year }));
    },
    refreshNetWorthItems: ({ year }) => {
      dispatch(refreshYear({ year }));
    },
    deleteAssetLiability: asset => dispatch(deleteAssetLiability(asset)),
    importNetWorthItems: ({ year, month }) =>
      dispatch(importNetWorthItems({ year, month })),
  }),
)(NetWorthScreen);
