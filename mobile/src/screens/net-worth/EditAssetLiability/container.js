import { connect } from 'react-redux';
import { updateAssetLiability } from '@src/actions/net-worth-assets';
import EditAssetLiability from './EditAssetLiability';

export default connect(
  state => ({
    assets: state.netWorth.assets,
    liabilities: state.netWorth.liabilities,
  }),
  dispatch => ({
    updateAssetLiability: asset => dispatch(updateAssetLiability(asset)),
  }),
)(EditAssetLiability);
