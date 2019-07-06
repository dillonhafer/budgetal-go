import { combineReducers } from "redux";

import netWorth from "@src/reducers/NetWorth";

const appReducers = combineReducers({
  netWorth,
});

export default appReducers;
