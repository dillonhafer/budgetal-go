import { combineReducers } from "redux";

import annualBudgetItems from "@src/reducers/AnnualBudgetItems";
import budget from "@src/reducers/Budget";
import users from "@src/reducers/Users";
import netWorth from "@src/reducers/NetWorth";

const appReducers = combineReducers({
  annualBudgetItems,
  budget,
  users,
  netWorth,
});

export default appReducers;
