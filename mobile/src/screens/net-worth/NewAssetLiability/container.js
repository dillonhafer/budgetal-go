import { connect } from 'react-redux';
import { createAssetLiability } from 'actions/net-worth-assets';
import NewAssetLiabilityScreen from './NewAssetLiability';

export default connect(
  state => ({
    assets: state.netWorth.assets,
    liabilities: state.netWorth.liabilities,
  }),
  dispatch => ({
    createAssetLiability: asset => dispatch(createAssetLiability(asset)),
  }),
)(NewAssetLiabilityScreen);
