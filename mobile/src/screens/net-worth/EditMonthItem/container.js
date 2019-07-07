import { connect } from "react-redux";
import { updateNetWorthItem } from "@src/reducers/NetWorth";
import EditMonthItemScreen from "./EditMonthItem";

export default connect(
  state => ({ ...state.netWorth }),
  dispatch => ({
    updateNetWorthItem: ({ item }) => dispatch(updateNetWorthItem({ item })),
  })
)(EditMonthItemScreen);
