import { connect } from "react-redux";
import { createAssetLiability } from "@src/reducers/NetWorth";
import NewAssetLiabilityScreen from "./NewAssetLiability";

export default connect(
  state => ({
    assets: state.netWorth.assets,
    liabilities: state.netWorth.liabilities,
  }),
  dispatch => ({
    createAssetLiability: asset => dispatch(createAssetLiability(asset)),
  })
)(NewAssetLiabilityScreen);
