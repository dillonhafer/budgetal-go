import { connect } from "react-redux";
import { createNetWorthItem } from "@src/reducers/NetWorth";
import NewMonthItemScreen from "./NewMonthItem";

export default connect(
  state => ({ ...state.netWorth }),
  dispatch => ({
    createNetWorthItem: ({ year, month, item }) =>
      dispatch(createNetWorthItem({ year, month, item })),
  })
)(NewMonthItemScreen);
