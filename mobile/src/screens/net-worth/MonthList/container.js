import { connect } from "react-redux";
import {
  deleteNetWorthItem,
  importNetWorthItems,
} from "@src/reducers/NetWorth";
import MonthList from "./MonthList";

const mapStateToProps = state => {
  return {
    assets: state.netWorth.assets,
    liabilities: state.netWorth.liabilities,
    months: state.netWorth.months,
  };
};

const mapDispatchToProps = dispatch => ({
  importNetWorthItems: ({ year, month }) =>
    dispatch(importNetWorthItems({ year, month })),
  deleteNetWorthItem: item => dispatch(deleteNetWorthItem(item)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MonthList);
