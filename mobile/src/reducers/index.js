import { combineReducers } from 'redux';

import annualBudgetItems from 'reducers/AnnualBudgetItems';
import budget from 'reducers/Budget';
import users from 'reducers/Users';
import netWorth from 'reducers/NetWorth';

const appReducers = combineReducers({
  annualBudgetItems,
  budget,
  users,
  netWorth,
});

export default appReducers;
