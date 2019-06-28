import { combineReducers } from "redux";

import budget from "@src/reducers/Budget";
import users from "@src/reducers/Users";
import netWorth from "@src/reducers/NetWorth";

const appReducers = combineReducers({
  budget,
  users,
  netWorth,
});

export default appReducers;
