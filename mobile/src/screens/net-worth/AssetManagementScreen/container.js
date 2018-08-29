import { connect } from 'react-redux';
import AssetManagementScreen from './AssetManagementScreen';

export default connect(state => ({
  assets: state.netWorth.assets,
  liabilities: state.netWorth.liabilities,
}))(AssetManagementScreen);
